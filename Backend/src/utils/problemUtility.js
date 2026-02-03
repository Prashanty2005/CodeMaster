const axios = require("axios");

const getlanguageById = (lang) => {
    const language = {
        "c++": 54,
        "cpp": 54,        // <--- ADD THIS LINE (Fixes the error)
        "java": 62,
        "javascript": 63,
        "js": 63,         // Good practice to add this too
        "python": 71,
        "py": 71
    };

    const langKey = lang ? lang.toLowerCase() : '';
    return language[langKey] || null;
};
const submitBatch = async (submissions) => {
    const RAPIDAPI_KEY = process.env.JUDGE0_RAPIDAPI_KEY
    const RAPIDAPI_HOST = process.env.JUDGE0_RAPIDAPI_HOST 
    
    if (!RAPIDAPI_KEY) {
        throw new Error('Judge0 RapidAPI key not configured');
    }

    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            base64_encoded: 'false'
        },
        headers: {
            'x-rapidapi-key': RAPIDAPI_KEY,
            'x-rapidapi-host': RAPIDAPI_HOST,
            'Content-Type': 'application/json'
        },
        data: { submissions },
        timeout: 10000 // 10 second timeout
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error('Judge0 Batch Submission Error:', error.response?.data || error.message);
        throw new Error(`Failed to submit to Judge0: ${error.message}`);
    }
};

const waiting = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const submitToken = async (resultTokens, maxRetries = 30) => {
    const RAPIDAPI_KEY = process.env.JUDGE0_RAPIDAPI_KEY;
    const RAPIDAPI_HOST = process.env.JUDGE0_RAPIDAPI_HOST || 'judge0-ce.p.rapidapi.com';
    
    if (!RAPIDAPI_KEY) {
        throw new Error('Judge0 RapidAPI key not configured');
    }

    const options = {
        method: 'GET',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            tokens: resultTokens.join(","),
            base64_encoded: 'false',
            fields: '*'
        },
        headers: {
            'x-rapidapi-key': RAPIDAPI_KEY,
            'x-rapidapi-host': RAPIDAPI_HOST
        },
        timeout: 5000
    };

    const fetchData = async () => {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error('Judge0 Fetch Error:', error.response?.data || error.message);
            throw new Error(`Failed to fetch results from Judge0: ${error.message}`);
        }
    };

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const result = await fetchData();
            
            if (!result.submissions || result.submissions.length === 0) {
                throw new Error('No submissions returned from Judge0');
            }

            const isResultObtained = result.submissions.every((r) => r.status_id > 2);
            
            if (isResultObtained) {
                return result.submissions;
            }
            
            // Exponential backoff
            const delay = Math.min(1000 * Math.pow(1.5, attempt), 5000);
            await waiting(delay);
            
        } catch (error) {
            if (attempt === maxRetries - 1) {
                throw error;
            }
            await waiting(1000);
        }
    }
    
    throw new Error('Max retries reached while waiting for Judge0 results');
};

module.exports = { getlanguageById, submitBatch, submitToken };