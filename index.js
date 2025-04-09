const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const generateLead = require('./utils/openai');

const app = express();
app.use(bodyParser.json());

// ⚙️ Configurare TOKEN Wix
const WIX_API_TOKEN = 'IST.eyJraWQiOiJQb3pIX2FDMiIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1wiaWRcIjpcIjkwYWYxN2YzLWRhNTQtNDhkMy05ODUyLTk4MDdiOTAzMjExY1wiLFwiaWRlbnRpdHlcIjp7XCJ0eXBlXCI6XCJhcHBsaWNhdGlvblwiLFwiaWRcIjpcImY1MzUwMmU2LTQxZWItNGQ3Yi1iZDI5LTc1MzQyYWU1MjU0NFwifSxcInRlbmFudFwiOntcInR5cGVcIjpcImFjY291bnRcIixcImlkXCI6XCI3ZTVjZjE0ZS05NjI4LTRjM2EtOWM0MC01NzgyNDFhY2QwYzZcIn19IiwiaWF0IjoxNzQ0MTgyNTAwfQ.Vip7kvfFKHfH4kp_47j6Y10X5x_QkyTaplqNLFbX9Ic27p2eHyZr7FVKdmzWv0D8tuaV2xUnM9u1jWpbwvo9mJjLlkceONYG5ySGNJs85zGgeUFqFU6Y_n1t9ADCxIa6L892pRTVLYo3Tu5eCQFIXQZVNha8DgcslRepb5q6rP0W-yEXBwCFTJKsOjbtWCkkcBIvItZBahJPafSnxmt0H8pMXwQ4dhr59OeqL4PEDhHhEm5EOX3TzMJA2b40B4WpVKfiM_CX-1J-Pcj4ukIE5ttuXC0IAvIxCi9LDu_cySeyrKQyjXCUc8EEIf_yob4Mkfcm3qsBkGKex40leGieMw';

const WIX_COLLECTION_ID = 'Leaduri';
const WIX_SITE_ID = '7e5cf14e-9628-4c3a-9c40-578241acd0c6';

// 📦 Funcție care salvează leadul direct în CMS Wix
async function salveazaLeadInWix(lead) {
  try {
    const response = await axios.post(
      `https://www.wixapis.com/wix-data/v2/items?dataCollectionId=${WIX_COLLECTION_ID}`,
      {
        data: {
          numeClient: lead.numeClient,
          emailClient: lead.emailClient,
          cerereClient: lead.cerereClient,
          firmaId: lead.firmaId,
          dataGenerarii: new Date().toISOString(),
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': WIX_API_TOKEN,
        }
      }
    );

    console.log("✅ Lead salvat în Wix CMS:", response.data);
  } catch (error) {
    console.error("❌ Eroare la salvarea leadului în Wix CMS:", error.response ? error.response.data : error.message);
  }
}

// 📩 Endpoint de test manual
app.post('/primestelead', async (req, res) => {
  const lead = req.body;
  console.log("📥 Lead primit manual:", lead);
  await salveazaLeadInWix(lead);
  res.json({ success: true, message: "Lead primit și trimis către Wix CMS." });
});

// 🕰️ Cronjob automat pentru generare leaduri
cron.schedule('*/5 * * * *', async () => {
  console.log("⏰ Cronjob activat: generare lead automat");
  try {
    const lead = await generateLead();
    console.log("✅ Lead generat de AI:", lead);
    await salveazaLeadInWix(lead);
  } catch (error) {
    console.error("❌ Eroare în cronjob:", error);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Skyward Scraper live pe portul ${port}`);
});
