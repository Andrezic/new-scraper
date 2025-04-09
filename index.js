import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
app.use(bodyParser.json());

const WIX_API_KEY = 'IST.eyJraWQiOi... (tokenul tău complet)';
const WIX_ACCOUNT_ID = '7e5cf14e-9628-4c3a-9c40-578241acd0c6';
const CMS_COLLECTION_ID = 'Leaduri';

app.post('/primestelead', async (req, res) => {
  console.log('📥 Primit lead:', req.body);

  const { numeClient, emailClient, cerereClient, firmaId } = req.body;

  try {
    const wixResponse = await axios.post(
      `https://www.wixapis.com/wix-data/v2/items`,
      {
        "dataCollectionId": CMS_COLLECTION_ID,
        "item": {
          "numeClient": numeClient,
          "emailClient": emailClient,
          "cerereClient": cerereClient,
          "firmaId": firmaId,
          "dataGenerarii": new Date().toISOString()
        }
      },
      {
        headers: {
          'Authorization': WIX_API_KEY,
          'Content-Type': 'application/json'
        },
        params: {
          "accountId": WIX_ACCOUNT_ID
        }
      }
    );

    console.log('✅ Lead trimis cu succes către Wix CMS:', wixResponse.data);
    res.json({ success: true, wixResponse: wixResponse.data });
  } catch (error) {
    console.error('❌ Eroare la trimiterea către Wix CMS:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
});

app.listen(3000, () => {
  console.log('🚀 Serverul rulează pe portul 3000');
});
