const axios = require('axios');

module.exports = async function generateLead(firmaInfo) {
  const prompt = `
Firma: ${firmaInfo.firmaNume}
Servicii: ${firmaInfo.firmaServicii}
Avantaje: ${firmaInfo.firmaAvantaje}
Prețuri: ${firmaInfo.firmaPreturi}
Telefon: ${firmaInfo.firmaTelefon}

Generează un lead relevant pentru această firmă. Leadul trebuie să fie autentic, ca și cum ar fi un client real interesat.

Format răspuns dorit:
- Nume client
- Email client
- Cerere client (ce solicită)
`;

  try {
    const response = await axios.post('https://api.openai.com/v1/completions', {
      model: 'text-davinci-003',
      prompt,
      max_tokens: 150,
      temperature: 0.7,
      n: 1,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    const text = response.data.choices[0].text.trim();
    console.log("🧠 Răspuns AI complet:", text);

    const [numeClientLine, emailClientLine, cerereClientLine] = text.split('\n').map(line => line.trim());

    return {
      numeClient: numeClientLine?.replace(/^- /, '') || 'Client necunoscut',
      emailClient: emailClientLine?.replace(/^- /, '') || 'email@exemplu.com',
      cerereClient: cerereClientLine?.replace(/^- /, '') || 'Solicitare nespecificată',
      firmaId: firmaInfo.firmaId,
    };
  } catch (error) {
    console.error("❌ Eroare OpenAI:", error);
    throw error;
  }
};
