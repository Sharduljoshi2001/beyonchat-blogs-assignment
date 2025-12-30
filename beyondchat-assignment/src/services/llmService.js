const { GoogleGenerativeAI } = require("@google/generative-ai");
//accessing the api key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//function to rewrite article using ai
const rewriteArticleWithAI = async (originalTitle, referenceContent) => {
    try {
        //selectng model(gemini-pro is text based)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        //creating a specific prompt for the ai
        const prompt = `
            You are a professional tech writer. 
            
            Task: Write a comprehensive, engaging article based on the following Title and Reference Content.
            
            Original Title: "${originalTitle}"
            
            Reference Content from top Google results:
            "${referenceContent}"
            
            Requirements:
            1. The article should be well-structured with headings.
            2. The content must be unique but inspired by the reference content.
            3. Tone: Professional and informative.
            4. IMPORTANT: At the very bottom, add a section called "References" and list the sources used (if urls are mentioned in text).
            5. Do not output markdown code blocks (like \`\`\`html), just give plain text or html formatted text.
        `;
        console.log(`sending request to gemini for: ${originalTitle}`);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return text;
    } catch (error) {
        console.log("error in llm service:", error.message);
        //if ai fails, returning null
        return null;
    }
};

module.exports = { rewriteArticleWithAI };