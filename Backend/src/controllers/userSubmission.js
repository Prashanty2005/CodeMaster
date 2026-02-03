const Problem = require("../models/problem");
const Submission = require("../models/submission");
const User = require("../models/user")
const {getlanguageById,submitBatch,submitToken} =require("../utils/problemUtility")
const submitCode = async(req,res)=>{ 
    try{
        const userId= req.result._id.toString();
        const problemId= req.params.id;

        const{code,language}=req.body;
        
        if(!userId || !problemId || !code || !language)
            return res.status(400).send("some fields are missing");

        //fetch the  problem from database
        const problem= await Problem.findById(problemId);
        //testcases(hidden)

        //before submission to judge0 i will store the code first to my 
        // database then update whatever the result the judge0 has given

        const submittedResult= await Submission.create({
            userId,
            problemId,
            code,
            language,
            testCasesPassed:0,
            status:'pending',
            testCasesTotal:problem.hiddenTestCases.length
        })

        //submit code to judge0

        const language_id = getlanguageById(language);
        if (!language_id) {
                return res.status(400).json({ 
                    success: false,
                    error: "Unsupported language",
                    message: `Language '${language}' is not supported. Supported languages: cpp, java, javascript, python`,
                    supportedLanguages: ['cpp', 'java', 'javascript', 'python']
                });
        }
        //prepare for judge0
        const submissions = [];
            for (const [testIndex, testCase] of problem.hiddenTestCases.entries()) {
                submissions.push({
                    source_code: code,
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
        const resultTokens = submitResult.map((value) => value.token);

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
        //update submittedresult
        let testCasesPassed=0;
        let runtime=0;
        let memory=0;
        let status='accepted';   
        let errorMessage= null;  
        for (const [testIndex, test] of testResults.entries()) {
            // Always accumulate runtime and memory
            runtime += parseFloat(test.time || 0);
            memory = Math.max(memory, test.memory || 0);
            
            if (test.status_id === 3) { // Accepted
                testCasesPassed++;
            } else {
                // Test failed
                if (test.status_id === 4 && !errorMessage) { // Compilation Error
                    status = 'error';
                    errorMessage = test.stderr || test.compile_output || 'Compilation error';
                } else if (status === 'accepted') {
                    // Only set to wrong if we haven't already found an error
                    status = 'wrong';
                }
            }
        }

        // If all tests passed, status should be 'accepted'
        if (testCasesPassed === testResults.length) {
            status = 'accepted';
        }

        submittedResult.status=status;
        submittedResult.testCasesPassed=testCasesPassed;
        submittedResult.runtime=runtime
        submittedResult.memory=memory
        submittedResult.errorMessage=errorMessage;

        await submittedResult.save();

        //we will insert problemId in user schema if problem is solved and status is accepted and it is not already present int it
        if (status === 'accepted') {
            // ⭐ IMPORTANT: Fetch fresh user from database
            const user = await User.findById(userId);
            if (user && !user.problemSolved.includes(problemId)) {
                user.problemSolved.push(problemId);
                await user.save();
            }
        }
        const accepted=(status==='accepted')
        res.status(201).json({
            accepted,
            totalTestCases:submittedResult.testCasesTotal,
            passedTestCases:testCasesPassed,
            runtime,
            memory
        })
    }
    catch(err){
        res.status(500).send(err);
    }
}

const runCode = async(req,res) => {
     try{
        const userId= req.result._id.toString();
        const problemId= req.params.id;

        const{code,language}=req.body;
        
        if(!userId || !problemId || !code || !language)
            return res.status(400).send("some fields are missing");

        //fetch the  problem from database
        const problem= await Problem.findById(problemId);
        //testcases(hidden)

        //before submission to judge0 i will store the code first to my 
        // database then update whatever the result the judge0 has given

        

        //submit code to judge0

        const language_id = getlanguageById(language);
        if (!language_id) {
                return res.status(400).json({ 
                    success: false,
                    error: "Unsupported language",
                    message: `Language '${language}' is not supported. Supported languages: cpp, java, javascript, python`,
                    supportedLanguages: ['cpp', 'java', 'javaScript', 'python']
                });
        }
        //prepare for judge0
        const submissions = [];
            for (const [testIndex, testCase] of problem.visibleTestCases.entries()) {
                submissions.push({
                    source_code: code,
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
        const resultTokens = submitResult.map((value) => value.token);

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
        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = true;
        let errorMessage = null;

        for(const test of testResults){
            if(test.status_id==3){
            testCasesPassed++;
            runtime = runtime+parseFloat(test.time)
            memory = Math.max(memory,test.memory);
            }else{
                if(test.status_id==4){
                    status = false
                    errorMessage = test.stderr
                }
                else{
                    status = false
                    errorMessage = test.stderr
                }
            }
        }

        res.status(201).json({
            success:status,
            testCases: testResults,
            runtime,
            memory
        });
        
        res.status(201).send(testResults)
    }
    catch(err){
        res.status(500).send(err);
    }
}
module.exports = {submitCode,runCode};

/*language_id: 54,
    stdin: '{"nums":[1]}',
    expected_output: '1',
    stdout: '1',
    status_id: 3,
    created_at: '2026-01-02T12:57:21.671Z',
    finished_at: '2026-01-02T12:57:22.352Z',
    time: '0.002',
    memory: 1032,
    stderr: null,
    token: 'af1bc59f-b812-4aed-97c9-8438b1b7f206',*/