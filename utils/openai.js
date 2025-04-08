const axios = require('axios');

module.exports = async function generateLead(firmaInfo) {
  try {
    const prompt = `
Firma: ${firmaInfo.firmaNume}
Email: ${firmaInfo.firmaEmail}
Telefon: ${firmaInfo.firmaTelefon}
Website: ${firmaInfo.firmaWebsite}
Servicii: ${firmaInfo.firmaServicii}
Avantaje: ${firmaInfo.firmaAvantaje}
Prețuri: ${firmaInfo.firmaPreturi}
Tip clienți: ${firmaInfo.firmaTipClienti}

Generează un lead relevant pentru această firmă. Leadul trebuie să fie autentic, ca și cum ar fi un client real interesat.

Format răspuns dorit:
- Nume client
- Email client
- Cerere client (ce solicită)
`;

    const response = await axios.post('https://api.openai.com/v1/completions', {
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 150,
      temperature: 0.7,
      n: 1
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    const aiText = response.data.choices[0].text.trim();
    console.log("🧠 Răspuns AI complet:", aiText);

    const [nume, email, cerere] = aiText.split('\n').map(line => line.replace(/^.*?:\s*/, '').trim());

    return {
      numeClient: nume,
      emailClient: email,
      cerereClient: cerere,
      firmaId: firmaInfo.firmaNume
    };

  } catch (error) {
    console.error("❌ Eroare OpenAI:", error);
    throw error;
  }
};
