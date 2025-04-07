const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const generateLead = require('./utils/openai');
const axios = require('axios');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Endpoint manual de testare
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
    console.error("❌ Eroare la procesarea leadului:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Endpoint ping pentru UptimeRobot
app.get('/ping', (req, res) => {
  res.status(200).send('✅ Skyward Scraper online');
});

// ✅ CRONJOB automat la fiecare 5 minute
cron.schedule('*/5 * * * *', async () => {
  console.log("⏰ Cronjob activat: generare lead automat");

  try {
    // 1. Preluăm profilul firmei din Wix
    const profilResponse = await axios.get('https://www.skywardflow.com/_functions/getProfilFirma');
    console.log("🧩 Răspuns brut getProfilFirma:", profilResponse.data);

    if (!profilResponse.data || !profilResponse.data.items || profilResponse.data.items.length === 0) {
      console.warn('⚠️ Niciun profil de firmă găsit în Wix.');
      return;
    }

    const firmaInfo = profilResponse.data.items[0];
    console.log("📦 Profil firmă preluat:", firmaInfo);

    // 2. Generăm lead pe baza profilului
    const lead = await generateLead(firmaInfo);
    console.log("✅ Lead generat de AI:", lead);

    // 3. Trimitem lead-ul în Wix
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
