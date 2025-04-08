const express = require('express');
const puppeteer = require('puppeteer');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/genereaza', async (req, res) => {
  console.log('⏰ Start generare lead manual din cronjob extern');

  try {
    console.log('🚀 Lansăm browserul Puppeteer...');
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto('https://www.skywardflow.com/date-firma', { waitUntil: 'domcontentloaded' });

    const data = await page.evaluate(() => {
      return {
        firmaNume: document.querySelector('#inputNumeFirma')?.value || '',
        firmaEmail: document.querySelector('#inputEmailFirma')?.value || '',
        firmaTelefon: document.querySelector('#inputTelefonFirma')?.value || '',
        firmaWebsite: document.querySelector('#inputWebsiteFirma')?.value || '',
        firmaServicii: document.querySelector('#inputServicii')?.value || '',
        firmaAvantaje: document.querySelector('#inputAvantaje')?.value || '',
        firmaPreturi: document.querySelector('#inputPreturi')?.value || '',
        firmaTipClienti: document.querySelector('#inputTipClienti')?.value || '',
      };
    });

    console.log('📦 Profil firmă extras din HTML:', data);

    if (!data.firmaNume) {
      console.warn('⚠️ Nu s-au găsit date valide despre firmă în pagina publică.');
      await browser.close();
      return res.status(400).json({ error: 'Date incomplete' });
    }

    const prompt = `
Firma: ${data.firmaNume}
Servicii: ${data.firmaServicii}
Avantaje: ${data.firmaAvantaje}
Prețuri: ${data.firmaPreturi}
Telefon: ${data.firmaTelefon}

Generează un lead relevant pentru această firmă. Leadul trebuie să fie autentic, ca și cum ar fi un client real interesat.

Format răspuns dorit:
- Nume client
- Email client
- Cerere client (ce solicită)
    `;

    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003',
        prompt,
        max_tokens: 150,
        temperature: 0.7,
        n: 1,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const completions = response.data.choices[0].text.trim();
    console.log('🧠 Răspuns AI complet:', completions);

    const [numeClient, emailClient, cerereClient] = completions.split('\n').map(line => line.replace(/^-\s*/, '').trim());

    const lead = {
      numeClient,
      emailClient,
      cerereClient,
      firmaId: data.firmaNume,
      dataGenerarii: new Date().toISOString(),
    };

    console.log('✅ Lead generat de AI:', lead);

    await axios.post('https://www.skywardflow.com/_functions/receiveLeadFromScraper', lead);
    console.log('✅ Lead trimis cu succes către Wix');

    await browser.close();

    res.status(200).json({ success: true, lead });
  } catch (error) {
    console.error('❌ Eroare generală în generare lead:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`✅ Skyward Scraper live on port ${port}`);
});
