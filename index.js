const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { generatePrompt } = require("./utils/openai");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());

// Endpoint principal pentru generare lead
app.post("/genereaza", async (req, res) => {
  const firma = req.body;

  // ✅ Verificăm datele primite
  if (!firma || !firma.firmaId || !firma.firmaNume || !firma.firmaServicii || !firma.firmaEmail || !firma.firmaTelefon) {
    console.error("❌ Date incomplete primite:", firma);
    return res.status(400).json({ success: false, error: "Date incomplete primite pentru generare lead." });
  }

  try {
    console.log("🧩 Generăm promptul AI pe baza profilului firmei...");
    const prompt = generatePrompt(firma);

    console.log("🧠 Prompt generat:", prompt);

    // ✅ Trimitem promptul către OpenAI pentru generarea leadului
    const aiResponse = await axios.post("https://api.openai.com/v1/completions", {
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 200
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    const aiText = aiResponse.data.choices[0].text.trim();

    console.log("📥 Răspuns AI:", aiText);

    // ✅ Trimitem lead-ul către Wix API
    await axios.post("https://www.skywardflow.com/_functions/receiveLeadFromScraper", {
      numeClient: "Lead automatizat AI",
      emailClient: "thisistestmail2025@gmail.com",
      cerereClient: aiText,
      firmaId: firma.firmaId
    });

    console.log("✅ Lead trimis către Wix cu succes!");

    res.status(200).json({ success: true, message: "Lead generat și trimis cu succes!" });
  } catch (error) {
    console.error("❌ Eroare în procesul de generare lead:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Skyward Scraper live on port ${PORT}`);
});
