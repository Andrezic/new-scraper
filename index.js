const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Tokenul tău Wix API — este deja actualizat aici ✅
const apiKey = 'IST.eyJraWQiOiJQb3pIX2FDMiIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1wiaWRcIjpcIjkwYWYxN2YzLWRhNTQtNDhkMy05ODUyLTk4MDdiOTAzMjExY1wiLFwiaWRlbnRpdHlcIjp7XCJ0eXBlXCI6XCJhcHBsaWNhdGlvblwiLFwiaWRcIjpcImY1MzUwMmU2LTQxZWItNGQ3Yi1iZDI5LTc1MzQyYWU1MjU0NFwifSxcInRlbmFudFwiOntcInR5cGVcIjpcImFjY291bnRcIixcImlkXCI6XCI3ZTVjZjE0ZS05NjI4LTRjM2EtOWM0MC01NzgyNDFhY2QwYzZcIn19IiwiaWF0IjoxNzQ0MTgyNTAwfQ.Vip7kvfFKHfH4kp_47j6Y10X5x_QkyTaplqNLFbX9Ic27p2eHyZr7FVKdmzWv0D8tuaV2xUnM9u1jWpbwvo9mJjLlkceONYG5ySGNJs85zGgeUFqFU6Y_n1t9ADCxIa6L892pRTVLYo3Tu5eCQFIXQZVNha8DgcslRepb5q6rP0W-yEXBwCFTJKsOjbtWCkkcBIvItZBahJPafSnxmt0H8pMXwQ4dhr59OeqL4PEDhHhEm5EOX3TzMJA2b40B4WpVKfiM_CX-1J-Pcj4ukIE5ttuXC0IAvIxCi9LDu_cySeyrKQyjXCUc8EEIf_yob4Mkfcm3qsBkGKex40leGieMw';

// Site ID-ul Wix — confirmat de tine anterior ✅
const siteId = '7d8a16ea-53e8-4922-858c-ff9b291f16a6';

app.use(bodyParser.json());

// Endpoint pentru primirea lead-urilor
app.post('/primestelead', async (req, res) => {
  try {
    const { numeClient, emailClient, cerereClient, firmaId } = req.body;

    const leadData = {
      fields: {
        numeClient,
        emailClient,
        cerereClient,
        firmaId,
        dataGenerarii: new Date().toISOString(),
      },
    };

    const wixResponse = await axios.post(
      `https://www.wixapis.com/wix-data/v2/collections/Leaduri/items`,
      leadData,
      {
        headers: {
          Authorization: apiKey,
          'Content-Type': 'application/json',
        },
        params: {
          siteId: siteId,
        },
      }
    );

    console.log('✅ Lead trimis cu succes către Wix CMS:', wixResponse.data);
    res.status(200).json({ success: true, data: wixResponse.data });
  } catch (error) {
    console.error('❌ Eroare la trimiterea lead-ului către Wix CMS:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
});

app.listen(port, () => {
  console.log(`✅ Server Hetzner live pe portul ${port}`);
});
