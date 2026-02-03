const Problem = require("../models/problem");
const Submission = require("../models/submission");
const {getlanguageById,submitBatch,submitToken} =require("../utils/problemUtility")
const submitCode = async(req,res)=>{
    try{
        const userId = req.result._id.toString();
        const problemId = req.params.id;
        const {code, language} = req.body;
        
        if(!userId || !problemId || !code || !language) {
            return res.status(400).send("some fields are missing");
        }

        const problem = await Problem.findById(problemId);
        const submittedResult = await Submission.create({
            userId,
            problemId,
            code,
            language,
            testCasesPassed: 0,
            status: 'pending',
            testCasesTotal: problem.hiddenTestCases.length
        });

        const language_id = getlanguageById(language);
        if (!language_id) {
            return res.status(400).json({ 
                success: false,
                error: "Unsupported language",
                message: `Language '${language}' is not supported.`,
                supportedLanguages: ['cpp', 'java', 'javascript', 'python']
            });
        }
        
        const submissions = [];
        for (const [testIndex, testCase] of problem.hiddenTestCases.entries()) {
            submissions.push({
                source_code: code,
                language_id: language_id,
                stdin: testCase.input,
                expected_output: testCase.output.trim()
            });
        }
        
        let submitResult;
        try {
            submitResult = await submitBatch(submissions);
        } catch (error) {
            console.error(`Judge0 submission failed:`, error);
            return res.status(503).json({
                success: false,
                error: "Code execution service unavailable",
                message: error.message
            });
        }       
        const resultTokens = submitResult.map((value) => value.token);

        let testResults;
        try {
            testResults = await submitToken(resultTokens);
        } catch (error) {
            console.error(`Judge0 result fetch failed:`, error);
            return res.status(504).json({
                success: false,
                error: "Code execution timeout",
                message: error.message
            });
        }          
        
        // ========== DEBUGGING ==========
        console.log("=== DEBUG: Judge0 Results ===");
        console.log("Number of test results:", testResults.length);
        console.log("testResults structure:", Array.isArray(testResults) ? "Array" : typeof testResults);
        
        if (Array.isArray(testResults)) {
            testResults.forEach((test, index) => {
                console.log(`\nTest ${index + 1}:`);
                console.log(`  Status ID: ${test.status_id}`);
                console.log(`  Status: ${test.status?.description || 'No description'}`);
                console.log(`  Time: ${test.time}`);
                console.log(`  Memory: ${test.memory}`);
                if (test.compile_output) console.log(`  Compile Output: ${test.compile_output.substring(0, 200)}`);
                if (test.stderr) console.log(`  stderr: ${test.stderr.substring(0, 200)}`);
                if (test.stdout) console.log(`  stdout: ${test.stdout?.substring(0, 200)}`);
            });
        } else {
            console.log("testResults is not an array:", testResults);
        }
        console.log("=== END DEBUG ===\n");
        // ========== END DEBUGGING ==========
        
        // Update submitted result - SIMPLIFIED LOGIC
        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let overallStatus = 'pending';
        let errorMessage = null;
        
        // Check if testResults is an array
        if (!Array.isArray(testResults) || testResults.length === 0) {
            overallStatus = 'error';
            errorMessage = 'No test results returned from Judge0';
        } else {
            // Check each test result
            let hasCompilationError = false;
            let hasRuntimeError = false;
            let hasWrongAnswer = false;
            
            for (const test of testResults) {
                // Accumulate runtime and memory
                runtime += parseFloat(test.time || 0);
                memory = Math.max(memory, test.memory || 0);
                
                // Check status
                if (test.status_id === 3) { // Accepted
                    testCasesPassed++;
                } 
                else if (test.status_id === 4) { // Compilation Error
                    hasCompilationError = true;
                    errorMessage = test.compile_output || test.stderr || 'Compilation error';
                }
                else if (test.status_id === 5 || test.status_id === 6) { // Time limit or Runtime error
                    hasRuntimeError = true;
                    errorMessage = test.stderr || (test.status_id === 5 ? 'Time limit exceeded' : 'Runtime error');
                }
                else { // Wrong answer or other errors
                    hasWrongAnswer = true;
                }
            }
            
            // Determine final status
            if (hasCompilationError) {
                overallStatus = 'error';
                testCasesPassed = 0; // No tests pass with compilation error
            } else if (hasRuntimeError) {
                overallStatus = 'error';
            } else if (testCasesPassed === testResults.length) {
                overallStatus = 'accepted';
            } else if (hasWrongAnswer) {
                overallStatus = 'wrong';
            } else {
                overallStatus = 'error'; // fallback
            }
        }

        submittedResult.status = overallStatus;
        submittedResult.testCasesPassed = testCasesPassed;
        submittedResult.runtime = runtime;
        submittedResult.memory = memory;
        submittedResult.errorMessage = errorMessage;

        await submittedResult.save();

        return res.status(201).json(submittedResult);
    }
    catch(err){
        console.error("Error in submitCode:", err);
        return res.status(500).send("Internal server error: " + err.message);
    }
}

module.exports = {submitCode};

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