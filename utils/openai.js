// utils/openai.js

const axios = require('axios');

const OPENAI_API_KEY = 'cheia-ta-api-openai-aici';

async function generateLead() {
    const prompt = `
    Generează un lead de test pentru o firmă din domeniul Automatizări AI.
    Returnează doar JSON cu următoarele câmpuri:
    - numeClient
    - emailClient
    - cerereClient
    - firmaId (folosește testFirmaId)
    `;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                }
            }
        );

        const text = response.data.choices[0].message.content.trim();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Nu s-a găsit JSON valid în răspunsul AI.");
        }

        const lead = JSON.parse(jsonMatch[0]);
        return lead;

    } catch (error) {
        console.error("❌ Eroare OpenAI:", error.response?.data || error.message);
        throw error;
    }
}

module.exports = { generateLead };
