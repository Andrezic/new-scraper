const axios = require('axios');

module.exports = async function generateLead(firmaInfo) {
  const messages = [
    {
      role: "system",
      content: "Ești un generator de leaduri pentru o firmă din România. Primești detalii despre firmă și trebuie să generezi un lead autentic."
    },
    {
      role: "user",
      content: `
Firma: ${firmaInfo.firmaNume || 'Nespecificat'}
Servicii: ${firmaInfo.firmaServicii || 'Nespecificat'}
Avantaje: ${firmaInfo.firmaAvantaje || 'Nespecificat'}
Prețuri: ${firmaInfo.firmaPreturi || 'Nespecificat'}
Telefon: ${firmaInfo.firmaTelefon || 'Nespecificat'}

Generează un lead relevant pentru această firmă. Leadul trebuie să fie autentic, ca și cum ar fi un client real interesat.

Format răspuns dorit:
- Nume client
- Email client
- Cerere client (ce solicită)
      `
    }
  ];

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 150,
      temperature: 0.7,
      n: 1,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    const text = response.data.choices[0].message.content.trim();
    console.log("🧠 Răspuns AI complet:", text);

    const [numeClientLine, emailClientLine, cerereClientLine] = text.split('\n').map(line => line.trim());

    return {
      numeClient: numeClientLine?.replace(/^- /, '') || 'Client necunoscut',
      emailClient: emailClientLine?.replace(/^- /, '') || 'email@exemplu.com',
      cerereClient: cerereClientLine?.replace(/^- /, '') || 'Solicitare nespecificată',
      firmaId: firmaInfo.firmaId,
    };
  } catch (error) {
    console.error("❌ Eroare OpenAI:", error.response?.data || error.message);
    throw error;
  }
};
