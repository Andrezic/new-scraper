const fetch = require('node-fetch');

const API_KEY = '🔑 AICI PUI CHEIA TA OPENAI'; // înlocuiești cu cheia ta

async function generateLeadFromOpenAI(profilFirma) {
  try {
    const prompt = `
Analizează profilul firmei și generează o cerere de client interesat.

Profil Firmă:
Nume: ${profilFirma.numeFirma}
Servicii: ${profilFirma.servicii}
Avantaje: ${profilFirma.avantaje}

Generează o cerere relevantă:
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Eroare OpenAI API:", data);
      throw new Error("OpenAI API error");
    }

    const message = data.choices[0].message.content.trim();
    console.log("🧠 OpenAI a generat:", message);

    return message;
  } catch (error) {
    console.error("❌ Eroare la generarea cererii din OpenAI:", error);
    return "Cerere generată automat.";
  }
}

module.exports = { generateLeadFromOpenAI };
