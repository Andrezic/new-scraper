const axios = require('axios');

async function generateLead(firma) {
  const prompt = `
Firma: ${firma.firmaNume}
Servicii: ${firma.firmaServicii}
Avantaje: ${firma.firmaAvantaje || 'Nespecificat'}
Prețuri: ${firma.firmaPreturi || 'Nespecificat'}
Tip clienți: ${firma.firmaTipClienti || 'Nespecificat'}

Generează un lead relevant pentru această firmă. Leadul trebuie să fie autentic, ca și cum ar fi un client real interesat.

Format răspuns dorit:
- Nume client
- Email client
- Cerere client (ce solicită)

`;

  const apiKey = process.env.OPENAI_API_KEY;

  const response = await axios.post('https://api.openai.com/v1/completions', {
    model: 'text-davinci-003',
    prompt,
    max_tokens: 150,
    temperature: 0.7,
    n: 1,
    stop: null,
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
  });

  const text = response.data.choices[0].text.trim();
  const [numeClient, emailClient, cerereClient] = text.split('\n').map(l => l.replace('-', '').trim());

  return {
    numeClient,
    emailClient,
    cerereClient,
    firmaId: firma.firmaId
  };
}

module.exports = { generateLead };
