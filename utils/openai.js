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
    const response = await axios.post("https://api.openai.com/v1/completions", {
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 150,
      temperature: 0.7,
      n: 1
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    const text = response.data.choices[0].text.trim();
    const [numeClient, emailClient, cerereClient] = text.split("\n").map(x => x.replace(/^.*?:\s*/, '').trim());

    return {
      numeClient,
      emailClient,
      cerereClient,
      firmaId: firmaInfo.firmaNume
    };

  } catch (error) {
    console.error("❌ Eroare OpenAI:", error);
    throw error;
  }
};
