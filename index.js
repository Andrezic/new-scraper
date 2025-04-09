const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const WIX_API_URL = 'https://www.wixapis.com/wix-data/v2/items';
const WIX_API_KEY = 'IST.eyJraWQiOiJQb3pIX2FDMiIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1wiaWRcIjpcIjkwYWYxN2YzLWRhNTQtNDhkMy05ODUyLTk4MDdiOTAzMjExY1wiLFwiaWRlbnRpdHlcIjp7XCJ0eXBlXCI6XCJhcHBsaWNhdGlvblwiLFwiaWRcIjpcImY1MzUwMmU2LTQxZWItNGQ3Yi1iZDI5LTc1MzQyYWU1MjU0NFwifSxcInRlbmFudFwiOntcInR5cGVcIjpcImFjY291bnRcIixcImlkXCI6XCI3ZTVjZjE0ZS05NjI4LTRjM2EtOWM0MC01NzgyNDFhY2QwYzZcIn19IiwiaWF0IjoxNzQ0MTgyNTAwfQ.Vip7kvfFKHfH4kp_47j6Y10X5x_QkyTaplqNLFbX9Ic27p2eHyZr7FVKdmzWv0D8tuaV2xUnM9u1jWpbwvo9mJjLlkceONYG5ySGNJs85zGgeUFqFU6Y_n1t9ADCxIa6L892pRTVLYo3Tu5eCQFIXQZVNha8DgcslRepb5q6rP0W-yEXBwCFTJKsOjbtWCkkcBIvItZBahJPafSnxmt0H8pMXwQ4dhr59OeqL4PEDhHhEm5EOX3TzMJA2b40B4WpVKfiM_CX-1J-Pcj4ukIE5ttuXC0IAvIxCi9LDu_cySeyrKQyjXCUc8EEIf_yob4Mkfcm3qsBkGKex40leGieMw';
const DATA_COLLECTION = 'Leaduri';
const SITE_ID = '7d8a16ea-53e8-4922-858c-ff9b291f16a6';

app.post('/primestelead', async (req, res) => {
  const lead = req.body;

  const wixData = {
    dataCollectionId: DATA_COLLECTION,
    fields: {
      numeClient: lead.numeClient,
      emailClient: lead.emailClient,
      cerereClient: lead.cerereClient,
      firmaId: lead.firmaId,
      dataGenerarii: new Date().toISOString()
    }
  };

  try {
    const response = await axios.post(WIX_API_URL, wixData, {
      headers: {
        Authorization: WIX_API_KEY,
        'Content-Type': 'application/json',
        'wix-site-id': SITE_ID
      }
    });

    console.log('✅ Lead salvat cu succes:', response.data);
    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error('❌ Eroare la salvarea leadului:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
});

app.listen(3000, () => {
  console.log('✅ Server Hetzner live pe portul 3000');
});
