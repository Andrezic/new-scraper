const axios = require('axios');

const OPENAI_API_KEY = 'SECRET_CHEIA_TA_OPENAI'; // pune cheia ta secretă aici

async function generateLeadUsingOpenAI(firmaData) {
  try {
    const prompt = `
    Firma: ${firmaData.firmaNume}
    Servicii: ${firmaData.firmaServicii}
    Avantaje: ${firmaData.avantaje || 'Nespecificat'}
    Prețuri: ${firmaData.preturi || 'Nespecificat'}
    Tip Clienți: ${firmaData.tipClienti || 'Nespecificat'}
    Website: ${firmaData.siteWeb || 'Nespecificat'}

    Generează o cerere autentică de la un client interesat de serviciile acestei firme. Scrie mesajul clientului:
    `;

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Generează leaduri realiste pentru firme, pe baza datelor oferite.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 150
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      }
    });

    const mesajGenerat = response.data.choices[0].message.content.trim();

    return {
      numeClient: "Client AI",
      emailClient: "lead-generat-ai@skywardflow.com",
      cerereClient: mesajGenerat,
      firmaId: firmaData.firmaId
    };

  } catch (error) {
    console.error('❌ Eroare la generarea leadului cu OpenAI:', error.message);
    throw error;
  }
}

module.exports = { generateLeadUsingOpenAI };
