const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const cheerio = require('cheerio');
const axios = require('axios');
const generateLead = require('./utils/openai');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Cronjob automat la fiecare 5 minute
cron.schedule('*/5 * * * *', async () => {
  console.log("⏰ Cronjob activat: generare lead automat");

  try {
    // Preluăm pagina publică
    const response = await axios.get('https://www.skywardflow.com/profil-firma');
    const html = response.data;
    const $ = cheerio.load(html);

    // Extragem datele din pagina publică cu ID-urile reale
    const firmaInfo = {
      firmaNume: $('#inputNumeFirma').val() || $('#inputNumeFirma').text() || '',
      firmaEmail: $('#inputEmailFirma').val() || $('#inputEmailFirma').text() || '',
      firmaTelefon: $('#inputTelefonFirma').val() || $('#inputTelefonFirma').text() || '',
      firmaWebsite: $('#inputWebsiteFirma').val() || $('#inputWebsiteFirma').text() || '',
      firmaServicii: $('#inputServicii').val() || $('#inputServicii').text() || '',
      firmaAvantaje: $('#inputAvantaje').val() || $('#inputAvantaje').text() || '',
      firmaPreturi: $('#inputPreturi').val() || $('#inputPreturi').text() || '',
      firmaTipClienti: $('#inputTipClienti').val() || $('#inputTipClienti').text() || '',
    };

    console.log("📦 Profil firmă extras din HTML:", firmaInfo);

    if (!firmaInfo.firmaNume || !firmaInfo.firmaServicii) {
      console.warn("⚠️ Nu s-au găsit date valide despre firmă în pagina publică.");
      return;
    }

    // Generăm lead cu AI
    const lead = await generateLead(firmaInfo);
    console.log("✅ Lead generat de AI:", lead);

    // Trimitem lead-ul către Wix
    const wixResponse = await fetch('https://www.skywardflow.com/_functions/receiveLeadFromScraper', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });

    if (!wixResponse.ok) throw new Error(`Scraper API response not OK: ${wixResponse.statusText}`);

    const data = await wixResponse.json();
    console.log("✅ Lead trimis cu succes către Wix:", data);

  } catch (error) {
    console.error("❌ Eroare în cronjob:", error.message);
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`✅ Skyward Scraper live on port ${port}`);
});
