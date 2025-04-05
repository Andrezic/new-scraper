const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function analizeazaLeaduri(text) {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Analizează cererea clientului și generează o descriere clară a nevoii de business, într-un format prietenos pentru IMM-uri." },
        { role: "user", content: text }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("❌ Eroare OpenAI:", error.message);
    return "Cerere analizată: informații insuficiente.";
  }
}

module.exports = { analizeazaLeaduri };
