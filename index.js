// index.js

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Token-ul Wix generat de tine (cu all permissions)
const WIX_API_TOKEN = 'IST.eyJraWQiOiJQb3pIX2FDMiIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1wiaWRcIjpcIjkwYWYxN2YzLWRhNTQtNDhkMy05ODUyLTk4MDdiOTAzMjExY1wiLFwiaWRlbnRpdHlcIjp7XCJ0eXBlXCI6XCJhcHBsaWNhdGlvblwiLFwiaWRcIjpcImY1MzUwMmU2LTQxZWItNGQ3Yi1iZDI5LTc1MzQyYWU1MjU0NFwifSxcInRlbmFudFwiOntcInR5cGVcIjpcImFjY291bnRcIixcImlkXCI6XCI3ZTVjZjE0ZS05NjI4LTRjM2EtOWM0MC01NzgyNDFhY2QwYzZcIn19IiwiaWF0IjoxNzQ0MTgyNTAwfQ.Vip7kvfFKHfH4kp_47j6Y10X5x_QkyTaplqNLFbX9Ic27p2eHyZr7FVKdmzWv0D8tuaV2xUnM9u1jWpbwvo9mJjLlkceONYG5ySGNJs85zGgeUFqFU6Y_n1t9ADCxIa6L892pRTVLYo3Tu5eCQFIXQZVNha8DgcslRepb5q6rP0W-yEXBwCFTJKsOjbtWCkkcBIvItZBahJPafSnxmt0H8pMXwQ4dhr59OeqL4PEDhHhEm5EOX3TzMJA2b40B4WpVKfiM_CX-1J-Pcj4ukIE5ttuXC0IAvIxCi9LDu_cySeyrKQyjXCUc8EEIf_yob4Mkfcm3qsBkGKex40leGieMw';

// Account ID-ul tău Wix
const ACCOUNT_ID = '7e5cf14e-9628-4c3a-9c40-578241acd0c6';

// ID-ul colecției tale Wix CMS (Leaduri)
const COLLECTION_ID = 'Leaduri';

// Ruta principală pentru primirea leadurilor
app.post('/primestelead', async (req, res) => {
  const lead = req.body;

  console.log('📥 Lead primit:', lead);

  try {
    const response = await axios.post(
      `https://www.wixapis.com/wix-data/v2/collections/${COLLECTION_ID}/items`,
      {
        data: {
          numeClient: lead.numeClient,
          emailClient: lead.emailClient,
          cerereClient: lead.cerereClient,
          firmaId: lead.firmaId,
          dataGenerarii: new Date().toISOString(),
        },
      },
      {
        headers: {
          Authorization: WIX_API_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Lead salvat în Wix CMS:', response.data);
    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error('❌ Eroare la salvarea leadului în Wix CMS:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
});

// Pornim serverul
app.listen(3000, () => {
  console.log('✅ Server Hetzner live pe portul 3000');
});
