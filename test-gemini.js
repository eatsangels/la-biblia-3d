const { GoogleGenerativeAI } = require("@google/generative-ai");

// Using the key provided by the user
const apiKey = "AIzaSyCgUZQIriT6Krt7djX5bSAbNitDjCwxBoM";
const genAI = new GoogleGenerativeAI(apiKey);

async function checkModels() {
  const models = ["gemini-pro", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"];

  console.log("Starting model check for API key ending in ...", apiKey.slice(-4));

  for (const modelName of models) {
    try {
      console.log(`Checking ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say hello");
      console.log(`✅ ${modelName} SUCCESS:`, result.response.text());
    } catch (error) {
      console.error(`❌ ${modelName} FAILED:`, error.message.split(']')[1] || error.message);
    }
  }
}

checkModels();
