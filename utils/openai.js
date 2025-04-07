const axios = require('axios');

const OPENAI_API_KEY = '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';

async function generateLead(firma) {
  const prompt = `
Firma: ${firma.firmaNume || "Nespecificat"}
Servicii: ${firma.firmaServicii || "Nespecificat"}
Avantaje: ${firma.firmaAvantaje || "Nespecificat"}
Prețuri: ${firma.firmaPreturi || "Nespecificat"}
Tip clienți: ${firma.firmaTipClienti || "Nespecificat"}

Generează un lead relevant pentru această firmă. Leadul trebuie să fie autentic, ca și cum ar fi un client real interesat.

Format răspuns dorit:
- Nume client
- Email client
- Cerere client (ce solicită)
`;

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 150
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      }
    });

    const aiResponse = response.data.choices[0].message.content;
    console.log('✅ Răspuns AI:', aiResponse);
    return aiResponse;

  } catch (error) {
    console.error('❌ Eroare la procesarea leadului:', error);
    throw error;
  }
}

module.exports = { generateLead };
