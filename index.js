const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const puppeteer = require('puppeteer');
const generateLead = require('./utils/openai');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Funcție pentru extragerea datelor cu Puppeteer
async function extrageDateFirma() {
  console.log("🚀 Lansăm browserul Puppeteer...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  try {
    await page.goto('https://www.skywardflow.com/date-firma', { waitUntil: 'networkidle0' });
    console.log("✅ Pagina încărcată, extragem datele...");

    // Extragere date din pagina publică
    const firmaInfo = await page.evaluate(() => {
      const getText = (selector) => {
        const el = document.querySelector(selector);
        return el ? el.textContent.trim() : '';
      };

      return {
        firmaNume: getText('#inputNumeFirma'),
        firmaEmail: getText('#inputEmailFirma'),
        firmaTelefon: getText('#inputTelefonFirma'),
        firmaWebsite: getText('#inputWebsiteFirma'),
        firmaServicii: getText('#inputServicii'),
        firmaAvantaje: getText('#inputAvantaje'),
        firmaPreturi: getText('#inputPreturi'),
        firmaTipClienti: getText('#inputTipClienti'),
      };
    });

    console.log("📦 Profil firmă extras din pagina publică:", firmaInfo);
    await browser.close();
    return firmaInfo;

  } catch (error) {
    console.error("❌ Eroare la extragerea datelor:", error);
    await browser.close();
    return null;
  }
}

// Cronjob automat la fiecare 5 minute
cron.schedule('*/5 * * * *', async () => {
  console.log("⏰ Cronjob activat: generare lead automat");

  const firmaInfo = await extrageDateFirma();

  if (!firmaInfo || !firmaInfo.firmaNume || !firmaInfo.firmaServicii) {
    console.warn("⚠️ Date incomplete, oprim procesarea.");
    return;
  }

  try {
    const lead = await generateLead(firmaInfo);
    console.log("✅ Lead generat de AI:", lead);

    const wixResponse = await fetch('https://www.skywardflow.com/_functions/receiveLeadFromScraper', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });

    if (!wixResponse.ok) throw new Error(`Wix API response not OK: ${wixResponse.statusText}`);

    const data = await wixResponse.json();
    console.log("✅ Lead trimis cu succes către Wix:", data);

  } catch (error) {
    console.error("❌ Eroare în cronjob:", error);
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`✅ Skyward Scraper live on port ${port}`);
});
