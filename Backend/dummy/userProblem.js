const Problem = require("../models/problem");
const { getlanguageById, submitBatch, submitToken } = require("../utils/problemUtility");

const createProblem = async (req, res) => {
    try {
        console.log("=== CREATE PROBLEM START ===");
        console.log("Request body:", JSON.stringify(req.body, null, 2));
        console.log("Authenticated user (req.result):", req.result);
        
        // Check if req.result exists
        if (!req.result || !req.result._id) {
            return res.status(401).json({
                error: "Authentication required",
                message: "No authenticated user found"
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

        // Use the user ID from authenticated user
        const problemCreater = req.result._id;
        
        for (const { language, completeCode } of referenceSolution) {
            console.log(`Testing ${language} solution...`);
            
            const language_id = getlanguageById(language);
            
            const submissions = [];
            for (const { input, output } of visibleTestCases) {
                submissions.push({
                    source_code: completeCode,
                    language_id: language_id,
                    stdin: input,
                    expected_output: output
                });
            }

            // Submit to Judge0
            const submitResult = await submitBatch(submissions) // will get our tokens
            console.log(submitResult);
            const resultToken = submitResult.map((value) => value.token);
            
            // Get test results from Judge0
            const testResult = await submitToken(resultToken);
            
            // Check if any test failed
            for (const test of testResult) {
                if (test.status_id !== 3) { // 3 = Accepted
                    return res.status(400).json({ 
                        error: "Reference solution failed test cases",
                        details: {
                            language: language,
                            testCase: test.stdin,
                            expected: test.expected_output,
                            actual: test.stdout,
                            status: test.status.description
                        }
                    });
                }
            }
        }

        // 2. Create the problem document
        console.log("All tests passed. Creating problem in database...");
        
        const problemData = {
            title,
            description,
            difficulty,
            tags, // String - must match enum in schema
            visibleTestCases,
            hiddenTestCases,
            startCode,
            referenceSolution,
            problemCreater: problemCreater // ObjectId from authenticated user
        };

        console.log("Problem data to save:", problemData);

        // 3. Save to database
        const savedProblem = await Problem.create(problemData);
        
        res.status(201).json({ 
            success: true, 
            message: "Problem created successfully",
            problemId: savedProblem._id,
            problem: {
                id: savedProblem._id,
                title: savedProblem.title,
                difficulty: savedProblem.difficulty,
                tags: savedProblem.tags
            }
        });

    } catch (err) {
        console.error("=== CREATE PROBLEM ERROR ===");
        console.error("Error:", err);
        console.error("Error name:", err.name);
        console.error("Error message:", err.message);
        
        if (err.name === 'ValidationError') {
            const errors = {};
            for (const field in err.errors) {
                errors[field] = err.errors[field].message;
            }
            console.error("Validation errors:", errors);
            
            return res.status(400).json({ 
                error: "Validation failed",
                errors: errors
            });
        }
        
        if (err.code === 11000) {
            console.error("Duplicate key error");
            return res.status(400).json({ 
                error: "Duplicate problem",
                message: "A problem with this title already exists"
            });
        }
        
        res.status(500).json({ 
            error: "Internal server error",
            message: err.message
        });
    }
}

module.exports = createProblem;
