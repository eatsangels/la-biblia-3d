'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || '');

export async function askGemini(query: string) {
    console.log("Asking Gemini:", query);
    if (!apiKey) {
        console.error("Gemini API Key missing in process.env");
        return { error: 'Gemini API Key not configured' };
    }

    try {
        // Updated to lighter/faster model
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `
        Actúa como un experto teólogo y un índice bíblico avanzado.
        El usuario hará una pregunta o pedirá un tema.
        Tu trabajo es:
        1. Responder brevemente con sabiduría bíblica (máximo 2 oraciones).
        2. Proporcionar 3 palabras clave precisas para buscar en la base de datos.
           IMPORTANTE: Separa las palabras clave con el operador ingles " OR " (en mayusculas) para que la búsqueda sea amplia.
           Ejemplo: "ansiedad OR miedo OR paz"
        
        Formato de respuesta JSON:
        {
            "answer": "Texto de la respuesta...",
            "keywords": "palabra1 OR palabra2 OR palabra3" 
        }

        Consulta del usuario: "${query}"
        Responde SOLO con el JSON.
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Clean markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(jsonStr);
    } catch (error) {
        console.error('Gemini Error (Server Action):', error);
        return { error: 'Failed to consult the divine intelligence.' };
    }
}
