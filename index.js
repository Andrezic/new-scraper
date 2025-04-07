const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const generateLead = require('./utils/openai');
const axios = require('axios');

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
    // 1. Preluăm datele reale din Wix
    const profilResponse = await axios.get('https://www.skywardflow.com/_functions/getProfilFirma');

    if (!profilResponse.data || !profilResponse.data.items || profilResponse.data.items.length === 0) {
      throw new Error('❌ Niciun profil de firmă găsit.');
    }

    const firmaInfo = profilResponse.data.items[0]; // luam primul profil gasit

    console.log("📦 Profil firmă preluat:", firmaInfo);

    // 2. Generăm lead
    const lead = await generateLead(firmaInfo);
    console.log("✅ Lead generat de AI:", lead);

    // 3. Trimitem lead-ul către Wix
    const response = await fetch('https://www.skywardflow.com/_functions/receiveLeadFromScraper', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });

    if (!response.ok) throw new Error(`Scraper API response not OK: ${response.statusText}`);

    const data = await response.json();
    console.log("✅ Lead trimis cu succes către Wix:", data);

  } catch (error) {
    console.error("❌ Eroare în cronjob:", error.response?.data || error.message);
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`✅ Skyward Scraper live on port ${port}`);
});
