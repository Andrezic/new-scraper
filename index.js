const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const generateLead = require('./utils/openai');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Endpoint manual de test
app.post('/genereaza', async (req, res) => {
  const firmaInfo = req.body;
  console.log("📥 Date primite de la Wix:", firmaInfo);

  try {
    const lead = await generateLead(firmaInfo);
    console.log("✅ Lead generat de AI:", lead);

    const response = await fetch('https://www.skywardflow.com/_functions/receiveLeadFromScraper', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });

    if (!response.ok) throw new Error(`Scraper API response not OK: ${response.statusText}`);

    const data = await response.json();
    console.log("✅ Lead trimis cu succes către Wix:", data);

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("❌ Eroare la procesarea leadului:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🎯 CRONJOB automat la fiecare 5 minute
cron.schedule('*/5 * * * *', async () => {
  console.log("⏰ Cronjob activat: generare lead automat");

  try {
    // Poți pune aici un profil demo sau unul real, momentan demo pentru test
    const firmaInfo = {
      numeFirma: "Test Firmă Demo",
      servicii: "Servicii demo pentru testare",
      avantaje: "Rapid și eficient",
      preturi: "100-200 lei",
      contact: "demo@skywardflow.com"
    };

    const lead = await generateLead(firmaInfo);
    console.log("✅ Lead generat de AI:", lead);

    const response = await fetch('https://www.skywardflow.com/_functions/receiveLeadFromScraper', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });

    if (!response.ok) throw new Error(`Scraper API response not OK: ${response.statusText}`);

    const data = await response.json();
    console.log("✅ Lead trimis cu succes către Wix:", data);
  } catch (error) {
    console.error("❌ Eroare în cronjob:", error);
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`✅ Skyward Scraper live on port ${port}`);
});
