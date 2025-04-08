const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Endpoint public pentru scraper
app.post('/primestelead', async (req, res) => {
  const lead = req.body;
  console.log('📥 Lead primit de la scraper:', lead);

  try {
    // Trimitem leadul direct în colecția Wix CMS folosind API REST
    const wixResponse = await axios.post(
      'https://www.skywardflow.com/_api/wix-code-namespace/v1/collections/Leaduri/items',
      {
        data: {
          numeClient: lead.numeClient,
          emailClient: lead.emailClient,
          cerereClient: lead.cerereClient,
          firmaId: lead.firmaId,
          dataGenerarii: new Date().toISOString()
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer TOKENUL_TAU_WIX',
        }
      }
    );

    console.log('✅ Lead salvat cu succes în Wix CMS:', wixResponse.data);
    res.status(200).json({ success: true, data: wixResponse.data });
  } catch (error) {
    console.error('❌ Eroare la salvarea leadului în Wix:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`✅ Server Hetzner live pe portul ${port}`);
});
