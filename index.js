// index.js complet pentru Hetzner -> Wix CMS direct ✅

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

// Înlocuiește cu token-ul și ID-urile tale
const API_KEY = 'IST.xxx'; // ✅ Pune aici tokenul tău complet API Key (Wix API Keys)
const SITE_ID = '7d8a16ea-53e8-4922-858c-ff9b291f16a6'; // ✅ Site ID-ul confirmat

app.use(bodyParser.json());

app.post('/primestelead', async (req, res) => {
  const lead = req.body;

  console.log('📥 Lead primit de la scraper:', lead);

  try {
    const wixResponse = await axios.post(
      `https://www.wixapis.com/wix-data/v2/items?dataCollectionId=Leaduri`,
      {
        "data": {
          "numeClient": lead.numeClient,
          "emailClient": lead.emailClient,
          "cerereClient": lead.cerereClient,
          "firmaId": lead.firmaId,
          "dataGenerarii": new Date().toISOString()
        }
      },
      {
        headers: {
          'Authorization': API_KEY,
          'Content-Type': 'application/json',
          'wix-site-id': SITE_ID
        }
      }
    );

    console.log('✅ Lead trimis cu succes în Wix CMS:', wixResponse.data);
    res.status(200).json({ success: true, wixResponse: wixResponse.data });

  } catch (error) {
    console.error('❌ Eroare la trimiterea în Wix CMS:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
});

app.listen(port, () => {
  console.log(`✅ Server Hetzner live pe portul ${port}`);
});
