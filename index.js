const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const generateLead = require('./utils/openai');

const app = express();
app.use(bodyParser.json());

// ⚙️ Configurare TOKEN Wix
const WIX_API_TOKEN = 'IST.eyJraWQiOiJQb3pIX2FDMiIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1wiaWRcIjpcIjU3NjNmOTViLWRjNzMtNGI0ZC1iNzU4LTNlMmM2YzkwNmFlNVwiLFwiaWRlbnRpdHlcIjp7XCJ0eXBlXCI6XCJhcHBsaWNhdGlvblwiLFwiaWRcIjpcIjNlYzA0MjgyLTMwZjktNGY4YS1hYTEzLTU4YWU5YTAyMzc1OFwifSxcInRlbmFudFwiOntcInR5cGVcIjpcImFjY291bnRcIixcImlkXCI6XCI3ZTVjZjE0ZS05NjI4LTRjM2EtOWM0MC01NzgyNDFhY2QwYzZcIn19IiwiaWF0IjoxNzQ0MTgxNTE5fQ.b3hRA6s_wYB6VoB5CUpZnkO_pTsDkDqNhMZBYCOjPBONYgjScUftvPcajhHBcF9m0DaCxDJEAuTH7tifOTOplOcQ_wCFeQDu85v84zG0uCeZy19NrA-4djWUvAIuhkAp58dRW2_Ardxu3cmA5ZUyJlcMhgtUJV7PVylH-9Pox7DxwdJSSq2ODdBV_sMW7kbnoxDPmxZcM4NQAYxFtdWkkBSpJLZLe9mh5yNMyhV-JiuXEHpQz6YTJFfCK-PFXf5W18ziM2JsnzEP5eQF25KycE7YHUKqGBUztmyqjTzMgcCUZR9Gq9UHb9Nh9QXfri9BXfbuXUXPO6YvVDawUNx0-A';

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
