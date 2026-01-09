const apiKey = "AIzaSyCgUZQIriT6Krt7djX5bSAbNitDjCwxBoM";

async function listModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    console.log("Querying API for available models...");

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", data.error);
            return;
        }

        console.log("\n✅ Available Models:");
        if (data.models) {
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log("No models found in response.");
            console.log("Raw response:", data);
        }
    } catch (error) {
        console.error("Network Error:", error);
    }
}

listModels();
