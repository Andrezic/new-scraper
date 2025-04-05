const fetch = require('node-fetch');

const OPENAI_API_KEY = 'cheia-ta-openai'; // 🔒 pune cheia ta OpenAI

async function genereazaLeadCuOpenAI(profil) {
  try {
    const prompt = `Creează un lead B2B pentru o companie care oferă ${profil.servicii}. Avantaje: ${profil.avantaje}. Prețuri: ${profil.preturi}. Telefon: ${profil.telefonFirma}.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 200
      })
    });

    const data = await response.json();

    const textGenerat = data.choices[0]?.message?.content?.trim() || 'Lead generic AI';
    console.log('✅ Răspuns OpenAI:', textGenerat);

    return {
      numeClient: 'Client AI Generat',
      emailClient: 'thisistestmail2025@gmail.com', // momentan email de test
      cerereClient: textGenerat
    };
  } catch (error) {
    console.error('❌ Eroare OpenAI:', error);
    throw new Error('Eroare la generarea leadului cu AI');
  }
}

module.exports = { genereazaLeadCuOpenAI };
