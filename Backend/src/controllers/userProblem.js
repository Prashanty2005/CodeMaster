const Problem = require("../models/problem");
const Submission = require("../models/submission");
const User = require("../models/user")
const solutionVideo=require("../models/solutionVideo")
const { getlanguageById, submitBatch, submitToken } = require("../utils/problemUtility");

const createProblem = async (req, res) => {
    try {
        

        // 1. Authentication check
        if (!req.result || !req.result._id) {
            return res.status(401).json({
                success: false,
                error: "Authentication required",
                message: "No authenticated admin user found"
            });
        }

        // 2. Verify user is admin
        if (req.result.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: "Forbidden",
                message: "Only administrators can create problems"
            });
        }

        const { 
            title, 
            description, 
            difficulty, 
            tags,
            visibleTestCases, 
            hiddenTestCases, 
            startCode,
            referenceSolution 
        } = req.body;

        // 3. Input validation
        const requiredFields = ['title', 'description', 'difficulty', 'visibleTestCases', 'referenceSolution'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields",
                message: `The following fields are required: ${missingFields.join(', ')}`,
                missingFields
            });
        }

        // Validate title uniqueness (case-insensitive)
        const existingProblem = await Problem.findOne({ 
            title: { $regex: new RegExp(`^${title.trim()}$`, 'i') } 
        });
        
        if (existingProblem) {
            return res.status(400).json({
                success: false,
                error: "Duplicate problem",
                message: "A problem with this title already exists"
            });
        }

        // Validate difficulty
        const validDifficulties = ['easy', 'medium', 'hard'];
        if (!validDifficulties.includes(difficulty.toLowerCase())) {
            return res.status(400).json({
                success: false,
                error: "Invalid difficulty",
                message: `Difficulty must be one of: ${validDifficulties.join(', ')}`,
                validDifficulties
            });
        }

        // Validate tags - convert string to array if needed
        let processedTags = [];
        if (typeof tags === 'string') {
            // If tags is a string like "array" or "array,hashmap"
            processedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        } else if (Array.isArray(tags)) {
            processedTags = tags.map(tag => tag.trim()).filter(tag => tag.length > 0);
        } else if (tags) {
            // If tags is some other type
            processedTags = [String(tags).trim()];
        }
        
        // Validate tags against enum values
        const validTags = ['array','string','hashtable','linkedlist','math','twopointers','tree','graph',
            'depthfirstsearch','breadthfirstsearch','binarysearch','dynamicprogramming','greedy','backtracking',
            'stack','queue','heap','slidingwindow','unionfind','trie','recursion','sorting','bitmanipulation',
            'divideandconquer','segmenttree','fenwicktree','topologicalsort','design','simulation','memoization'];
        const invalidTags = processedTags.filter(tag => !validTags.includes(tag));
        if (invalidTags.length > 0) {
            return res.status(400).json({
                success: false,
                error: "Invalid tags",
                message: `The following tags are not valid: ${invalidTags.join(', ')}`,
                validTags,
                receivedTags: processedTags
            });
        }

        // Validate visible test cases
        if (!Array.isArray(visibleTestCases) || visibleTestCases.length === 0) {
            return res.status(400).json({
                success: false,
                error: "Invalid test cases",
                message: "At least one visible test case is required"
            });
        }

        // Check each visible test case has all required fields
        for (const [index, testCase] of visibleTestCases.entries()) {
            if (!testCase.input || !testCase.output || !testCase.explanation) {
                return res.status(400).json({
                    success: false,
                    error: "Invalid test case",
                    message: `Test case ${index + 1} must have input, output, and explanation`,
                    testCaseIndex: index,
                    missingFields: [
                        !testCase.input && 'input',
                        !testCase.output && 'output',
                        !testCase.explanation && 'explanation'
                    ].filter(Boolean)
                });
            }
        }

        // Validate reference solution
        if (!Array.isArray(referenceSolution) || referenceSolution.length === 0) {
            return res.status(400).json({
                success: false,
                error: "Invalid reference solution",
                message: "At least one reference solution is required"
            });
        }

        // 4. Validate and test each reference solution
        console.log(`Testing ${referenceSolution.length} reference solution(s)...`);
        
        for (const [index, solution] of referenceSolution.entries()) {
            const { language, completeCode } = solution;
            
            console.log(`Testing ${language} solution ${index + 1}/${referenceSolution.length}...`);
            
            // Validate language
            const language_id = getlanguageById(language);
            if (!language_id) {
                return res.status(400).json({ 
                    success: false,
                    error: "Unsupported language",
                    message: `Language '${language}' is not supported. Supported languages: cpp, java, javascript, python`,
                    supportedLanguages: ['cpp', 'java', 'javascript', 'python']
                });
            }

            // Validate code
            if (!completeCode || typeof completeCode !== 'string' || completeCode.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    error: "Invalid solution code",
                    message: `Reference solution ${index + 1} has invalid or empty code`
                });
            }

            // Prepare submissions for Judge0
            const submissions = [];
            for (const [testIndex, testCase] of visibleTestCases.entries()) {
                submissions.push({
                    source_code: completeCode,
                    language_id: language_id,
                    stdin: testCase.input,
                    expected_output: testCase.output.trim()
                });
            }

            // Submit to Judge0
            let submitResult;
            try {
                submitResult = await submitBatch(submissions);
            } catch (error) {
                console.error(`Judge0 submission failed for ${language}:`, error);
                return res.status(503).json({
                    success: false,
                    error: "Code execution service unavailable",
                    message: `Failed to test ${language} solution: ${error.message}`,
                    solutionIndex: index
                });
            }

            if (!submitResult || !Array.isArray(submitResult)) {
                return res.status(500).json({
                    success: false,
                    error: "Code execution error",
                    message: `Failed to get tokens for ${language} solution`
                });
            }

            const resultTokens = submitResult.map((value) => value.token);
            
            // Get test results from Judge0
            let testResults;
            try {
                testResults = await submitToken(resultTokens);
            } catch (error) {
                console.error(`Judge0 result fetch failed for ${language}:`, error);
                return res.status(504).json({
                    success: false,
                    error: "Code execution timeout",
                    message: `Failed to get results for ${language} solution: ${error.message}`
                });
            }
            // Check if any test failed
            const failedTests = [];
            for (const [testIndex, test] of testResults.entries()) {
                if (test.status_id !== 3) { // 3 = Accepted
                    failedTests.push({
                        testIndex,
                        input: visibleTestCases[testIndex]?.input,
                        expected: visibleTestCases[testIndex]?.output,
                        actual: test.stdout || test.compile_output || test.stderr || 'No output',
                        status: test.status?.description || `Status ID: ${test.status_id}`,
                        time: test.time,
                        memory: test.memory
                    });
                }
            }

            if (failedTests.length > 0) {
                return res.status(400).json({ 
                    success: false,
                    error: "Reference solution failed test cases",
                    message: `${language} solution failed ${failedTests.length} test case(s)`,
                    details: {
                        language,
                        totalTests: testResults.length,
                        failedTests: failedTests.length,
                        failedTestDetails: failedTests
                    }
                });
            }
            
            console.log(`✓ ${language} solution passed all ${testResults.length} tests`);
        }

        // 5. Create the problem document - FIXED: Include explanation field
        console.log("All tests passed. Creating problem in database...");
        
        const problemData = {
            title: title.trim(),
            description: description.trim(),
            difficulty: difficulty.toLowerCase(),
            tags: processedTags, // Use processed tags array
            
            // Include ALL fields from visible test cases including explanation
            visibleTestCases: visibleTestCases.map(testCase => ({
                input: testCase.input,
                output: testCase.output.trim(),
                explanation: testCase.explanation // EXPLANATION IS REQUIRED BY SCHEMA
            })),
            
            hiddenTestCases: Array.isArray(hiddenTestCases) ? hiddenTestCases.map(testCase => ({
                input: testCase.input,
                output: testCase.output.trim()
            })) : [],
            
            startCode: Array.isArray(startCode) ? startCode.map(code => ({
                language: code.language,
                initialCode: code.initialCode
            })) : [],
            
            referenceSolution: referenceSolution.map(solution => ({
                language: solution.language,
                completeCode: solution.completeCode
            })),
            
            problemCreater: req.result._id
        };

        console.log("Problem data to save:", JSON.stringify(problemData, null, 2));

        // 6. Save to database
        const savedProblem = await Problem.create(problemData);
        
        
        
        // 7. Return success response
        res.status(201).json({ 
            success: true, 
            message: "Problem created successfully",
            problemId: savedProblem._id,
            validation: {
                solutionsTested: referenceSolution.length,
                allTestsPassed: true,
                totalVisibleTests: visibleTestCases.length,
                totalHiddenTests: hiddenTestCases?.length || 0
            },
            problem: {
                id: savedProblem._id,
                title: savedProblem.title,
                difficulty: savedProblem.difficulty,
                tags: savedProblem.tags,
                createdAt: savedProblem.createdAt
            }
        });

    } catch (err) {
        console.error("=== CREATE PROBLEM ERROR ===");
        console.error("Error:", err);
        console.error("Error name:", err.name);
        console.error("Error message:", err.message);
        
        let statusCode = 500;
        let errorResponse = { 
            success: false,
            error: "Internal server error",
            message: err.message
        };
        
        if (err.name === 'ValidationError') {
            statusCode = 400;
            const errors = {};
            for (const field in err.errors) {
                errors[field] = err.errors[field].message;
            }
            console.error("Validation errors:", errors);
            
            errorResponse = {
                success: false,
                error: "Validation failed",
                errors: errors,
                message: "Problem validation failed. Please check the input data."
            };
        } else if (err.code === 11000) {
            statusCode = 400;
            console.error("Duplicate key error:", err.keyValue);
            errorResponse = {
                success: false,
                error: "Duplicate problem",
                message: "A problem with this title already exists",
                duplicateField: Object.keys(err.keyValue)[0]
            };
        }
        
        res.status(statusCode).json(errorResponse);
    }
}

//user ke pass ek window rahegi usme sara saved problem data already rahega hame use change
//  karna hai aur vapas backend ko bhej dena hai , ab backend ka kam...
const updateProblem = async (req, res) => {
    const { id } = req.params;
    const { 
        title, 
        description, 
        difficulty, 
        tags,
        visibleTestCases, 
        hiddenTestCases, 
        startCode,
        referenceSolution 
    } = req.body;
    
    try {
        // Validate required fields
        if (!id) {
            return res.status(400).json({ 
                success: false, 
                error: "Missing problem ID" 
            });
        }

        // Check if all required fields are present
        const requiredFields = ['title', 'description', 'difficulty', 'tags', 'visibleTestCases', 'hiddenTestCases', 'startCode', 'referenceSolution'];
        for (const field of requiredFields) {
            if (!req.body[field] && req.body[field] !== '') {
                return res.status(400).json({
                    success: false,
                    error: `Missing required field: ${field}`
                });
            }
        }

        // Find the existing problem
        const dsaProblem = await Problem.findById(id);
        if (!dsaProblem) {
            return res.status(404).json({ 
                success: false, 
                error: "Problem not found" 
            });
        }

        console.log('Updating problem:', {
            id,
            title,
            tagsCount: tags ? tags.length : 0,
            visibleCases: visibleTestCases ? visibleTestCases.length : 0,
            hiddenCases: hiddenTestCases ? hiddenTestCases.length : 0
        });

        // Validate and test reference solutions (only if they are provided/changed)
        if (referenceSolution && Array.isArray(referenceSolution)) {
            console.log('Testing reference solutions...');
            
            for (const [index, solution] of referenceSolution.entries()) {
                const { language, completeCode } = solution;
                
                // Skip if no code provided (might be empty during partial update)
                if (!completeCode || completeCode.trim() === '') {
                    console.log(`Skipping empty solution for ${language}`);
                    continue;
                }

                console.log(`Testing ${language} solution...`);
                
                // Validate language
                const language_id = getlanguageById(language); // Changed from getlanguageById to getLanguageId
                if (!language_id) {
                    return res.status(400).json({ 
                        success: false,
                        error: "Unsupported language",
                        message: `Language '${language}' is not supported. Supported languages: C++, Java, JavaScript`,
                        solutionIndex: index
                    });
                }

                // Validate code
                if (typeof completeCode !== 'string' || completeCode.trim().length === 0) {
                    return res.status(400).json({
                        success: false,
                        error: "Invalid solution code",
                        message: `Reference solution for ${language} has invalid or empty code`
                    });
                }

                // Only test against visible test cases if they exist
                if (visibleTestCases && visibleTestCases.length > 0) {
                    console.log(`Running ${language} solution against ${visibleTestCases.length} test cases...`);
                    
                    // Prepare submissions for Judge0
                    const submissions = [];
                    for (const testCase of visibleTestCases) {
                        // Skip test cases without input/output
                        if (!testCase.input || !testCase.output) {
                            console.log('Skipping empty test case');
                            continue;
                        }
                        
                        submissions.push({
                            source_code: completeCode,
                            language_id: language_id,
                            stdin: testCase.input,
                            expected_output: testCase.output.trim()
                        });
                    }

                    // If there are valid test cases, submit to Judge0
                    if (submissions.length > 0) {
                        let submitResult;
                        try {
                            submitResult = await submitBatch(submissions);
                        } catch (error) {
                            console.error(`Judge0 submission failed for ${language}:`, error);
                            return res.status(503).json({
                                success: false,
                                error: "Code execution service unavailable",
                                message: `Failed to test ${language} solution: ${error.message}`
                            });
                        }

                        if (!submitResult || !Array.isArray(submitResult)) {
                            return res.status(500).json({
                                success: false,
                                error: "Code execution error",
                                message: `Failed to get tokens for ${language} solution`
                            });
                        }

                        const resultTokens = submitResult.map((value) => value.token);
                        
                        // Get test results from Judge0 with timeout
                        let testResults;
                        try {
                            testResults = await submitToken(resultTokens);
                        } catch (error) {
                            console.error(`Judge0 result fetch failed for ${language}:`, error);
                            return res.status(504).json({
                                success: false,
                                error: "Code execution timeout",
                                message: `Failed to get results for ${language} solution: ${error.message}`
                            });
                        }

                        // Check if any test failed
                        const failedTests = [];
                        for (const [testIndex, test] of testResults.entries()) {
                            if (test.status_id !== 3) { // 3 = Accepted
                                failedTests.push({
                                    testIndex,
                                    input: visibleTestCases[testIndex]?.input,
                                    expected: visibleTestCases[testIndex]?.output,
                                    actual: test.stdout || test.compile_output || test.stderr || 'No output',
                                    status: test.status?.description || `Status ID: ${test.status_id}`,
                                    time: test.time,
                                    memory: test.memory
                                });
                            }
                        }

                        if (failedTests.length > 0) {
                            console.log(`${language} solution failed ${failedTests.length} test(s)`);
                            return res.status(400).json({ 
                                success: false,
                                error: "Reference solution failed test cases",
                                message: `${language} solution failed ${failedTests.length} test case(s)`,
                                details: {
                                    language,
                                    totalTests: testResults.length,
                                    failedTests: failedTests.length,
                                    failedTestDetails: failedTests
                                }
                            });
                        }
                        
                        console.log(`✓ ${language} solution passed all tests`);
                    }
                }
            }
        }

        // Prepare update data
        const updateData = {
            title: title.trim(),
            description: description.trim(),
            difficulty: difficulty.toLowerCase(),
            tags: Array.isArray(tags) ? tags : [],
            visibleTestCases: visibleTestCases || [],
            hiddenTestCases: hiddenTestCases || [],
            startCode: startCode || [],
            referenceSolution: referenceSolution || [],
            updatedAt: Date.now()
        };

        

        // Update the problem
        const updatedProblem = await Problem.findByIdAndUpdate(
            id,
            updateData,
            { 
                runValidators: true, // Ensure mongoose validators run
                new: true, // Return the updated document
                context: 'query' // Helps with certain validators
            }
        );

        if (!updatedProblem) {
            return res.status(404).json({
                success: false,
                error: "Problem not found after update attempt"
            });
        }

        console.log('Problem updated successfully:', updatedProblem._id);

        // Return success response
        return res.status(200).json({
            success: true,
            message: "Problem updated successfully",
            data: updatedProblem
        });

    } catch (err) {
        console.error("Update problem error:", err);
        
        // Handle specific mongoose validation errors
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                error: "Validation Error",
                message: errors.join(', ')
            });
        }
        
        // Handle duplicate key errors (if any unique constraints)
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                error: "Duplicate Error",
                message: "A problem with similar title already exists"
            });
        }
        
        return res.status(500).json({
            success: false,
            error: "Server Error",
            message: "Failed to update problem. Please try again later."
        });
    }
};

const deleteProblem= async(req,res) => {
    const {id}= req.params;
    try{
        if(!id){
            throw new Error("id is missing of problem");
        }
        const ProblemToDelete= await Problem.findById(id);
        if(!ProblemToDelete){
           return res.status(400).send("problem does not exist");
        }

        const deleted=await Problem.findByIdAndDelete(id);
        res.status(200).send("succeessfully deleted")
    }
    catch(err){
        res.status(500).send("Error"+err)
    }
}

const getProblemById = async(req,res) => {
    const {id}= req.params;
    try{
        if(!id){
            throw new Error("id is missing of problem");
        }
        const getProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases hiddenTestCases startCode referenceSolution');

        if(!getProblem){
           return res.status(400).send("problem does not exist");
        }
        const videos= await solutionVideo.findOne({problemId:id});
        if(videos){
            const response = {
                ...getProblem.toObject(),
                secureUrl:videos.secureUrl,
                thumbnailUrl:videos.thumbnailUrl,
                duration:videos.duration
            }
            return res.status(200).send(response);
        }

        res.status(200).send(getProblem);
    }
    catch(err){
        res.status(500).send("Error"+err)
    }
}

const fetchAllProblem = async (req, res) => {
    try {
        // Extract query parameters. 
        const page = parseInt(req.query.page) || 1;
        // SMART CHECK: If no limit is provided in the URL, default to 0. (In MongoDB, limit(0) means "return everything")
        const limit = req.query.limit ? parseInt(req.query.limit) : 0; 
        
        const difficulty = req.query.difficulty;
        const tagsParam = req.query.tags;
        const search = req.query.search;

        // Build filter object
        let filter = {};

        if (difficulty && difficulty.toLowerCase() !== 'all') {
            filter.difficulty = new RegExp(`^${difficulty}$`, 'i'); // Case-insensitive exact match
        }

        if (tagsParam) {
            const tagsArray = tagsParam.split(',').map(tag => tag.trim()).filter(Boolean);
            if (tagsArray.length > 0) {
                filter.tags = { $all: tagsArray };
            }
        }

        if (search && search.trim() !== '') {
            const searchRegex = new RegExp(search.trim(), 'i');
            filter.$or = [
                { title: searchRegex },
                { tags: { $in: [searchRegex] } }
            ];
        }

        // Count total matching documents
        const total = await Problem.countDocuments(filter);

        // Build the query
        const problemsQuery = Problem.find(filter)
            .select('_id title difficulty tags') // Still keep it fast!
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit);

        // Only apply the limit if one was requested (e.g., from Update.jsx)
        if (limit > 0) {
            problemsQuery.limit(limit);
        }

        // Execute the query
        const problems = await problemsQuery;

        if (problems.length === 0 && page === 1) {
            return res.status(200).json({ message: "No problems found", problems: [], total: 0 });
        }

        // Return exactly what the Redux slice expects
        return res.status(200).json({ problems, total });
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error: " + err.message });
    }
};

const solvedProblemByUser =async(req,res) => {
    try{
        const userId = req.result._id;

        const user = await User.findById(userId).populate({
            path:"problemSolved",
            select:"_id title difficulty tags"
        });

        res.status(200).send(user.problemSolved);
    }
    catch(err){
        res.status(500).send(err);
    }
}

const submittedProblem = async(req,res) =>{
    try{
        const problemId = req.params.pid;
        const userId = req.result._id;

        const ans = await Submission.find({userId,problemId})

        if(ans.length===0)
            return res.status(200).send([]);

        res.status(200).send(ans);
    }
    catch(err){
        res.status(500).send(err);
    }
}

const chatAi = async(req,res)=>{
    try{
        
    }
    catch(err){
        res.status(500).send(err);
    }
}
module.exports = {createProblem,updateProblem,deleteProblem,getProblemById,fetchAllProblem,solvedProblemByUser,submittedProblem,chatAi};

