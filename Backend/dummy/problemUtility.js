const axios= require("axios");

const getlanguageById=(lang)=>{
    const language={
        "cpp":54,
        "java":62,
        "javascript":63,
        "python":71
    }

    return language[lang.toLowerCase()];
}

const submitBatch=async(submissions)=>{
    const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
        base64_encoded: 'false'
    },
    headers: {
        'x-rapidapi-key': '404d436a70msh0d4530f378b9e58p1b9e83jsn207d5e20d54f',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json'
    },
    data:{submissions}
    
    };

    async function fetchData() {
	    try {
		    const response = await axios.request(options);
		    return response.data;
	    } catch (error) {
		    console.error(error);
	    }
    }

    return await fetchData(); 
    //response.text will send the tokens for each test cases and we have to send that token again 
    //to judge 0 and now it will return the output in which there will be status ids and it will give the output
    
}
const waiting = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const submitToken=async(resultTokens)=>{

    const options = {
    method: 'GET',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
        tokens: resultTokens.join(","),// Result token is an array  but it expects it in strings separated by comma
        base64_encoded: 'false',
        fields: '*'
    },
    headers: {
        'x-rapidapi-key': '404d436a70msh0d4530f378b9e58p1b9e83jsn207d5e20d54f',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
    }
    };

    async function fetchData() {
	    try {
		    const response = await axios.request(options);
		    return response.data;
	    } catch (error) {
		    console.error(error);
	    }
    }
    while(true){
        const result=await fetchData();
        //if status id is 1 or 2 we have to send again test cases as our code has been not run
        const isResultObtained=result.submissions.every((r)=> r.status_id>2);
        if(isResultObtained)
            return result.submissions;

        await waiting(1000);
    }
    
}
module.exports= {getlanguageById,submitBatch,submitToken};



