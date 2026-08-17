const { GoogleGenAI } = require("@google/genai");

const getAiHint = async (req, res) => {
  try {
    const { problemTitle, userCode, failedInput, expectedOutput } = req.body;

    // Using the same SDK structure and env variable as solveDoubt.js
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINIAPI });
    
    const prompt = `Act as a harsh but helpful coding mentor. 
    The student is attempting the problem "${problemTitle}". 
    Their code failed.
    
    User Code:
    ${userCode}
    
    Failed Input:
    ${failedInput}
    
    Expected Output:
    ${expectedOutput}
    
    Explain exactly why the code failed on this specific input. Do not provide the correct code or the direct answer. Provide a conceptual hint on how to fix the logic.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return res.status(200).json({ 
      success: true, 
      hint: response.text 
    });

  } catch (error) {
    console.error("AI Hint Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Our AI mentor is currently unavailable. Please try again later." 
    });
  }
};

module.exports = getAiHint;
