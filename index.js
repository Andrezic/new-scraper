const puppeteer = require('puppeteer');
const generateLead = require('./utils/openai');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function extrageDateFirma() {
  console.log("🚀 Lansăm browserul Puppeteer...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  try {
    await page.goto('https://www.skywardflow.com/date-firma', { waitUntil: 'networkidle0' });
    console.log("✅ Pagina încărcată, așteptăm încărcarea completă a datelor...");

    await page.waitForSelector('#inputNumeFirma', { visible: true, timeout: 10000 });
    console.log("✅ Dataset încărcat complet, extragem datele...");

    const firmaInfo = await page.evaluate(() => {
      const getValue = (selector) => {
        const el = document.querySelector(selector);
        return el ? el.value.trim() : '';
      };

      return {
        firmaNume: getValue('#inputNumeFirma'),
        firmaEmail: getValue('#inputEmailFirma'),
        firmaTelefon: getValue('#inputTelefonFirma'),
        firmaWebsite: getValue('#inputWebsiteFirma'),
        firmaServicii: getValue('#inputServicii'),
        firmaAvantaje: getValue('#inputAvantaje'),
        firmaPreturi: getValue('#inputPreturi'),
        firmaTipClienti: getValue('#inputTipClienti'),
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

(async () => {
  console.log("⏰ Start generare lead manual din cronjob Render");

  const firmaInfo = await extrageDateFirma();

  if (!firmaInfo || !firmaInfo.firmaNume || !firmaInfo.firmaServicii) {
    console.warn("⚠️ Date incomplete, oprim procesarea.");
    process.exit(0);
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
    process.exit(0);

  } catch (error) {
    console.error("❌ Eroare în cronjob:", error);
    process.exit(1);
  }
})();
