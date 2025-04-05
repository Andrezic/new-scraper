// index.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { generateLead } = require('./utils/openai');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

app.post('/genereaza', async (req, res) => {
    console.log("🚀 Request primit pe endpoint /genereaza");

    try {
        // Generează lead cu AI
        const lead = await generateLead();
        console.log("✅ Lead generat:", lead);

        // Trimite lead-ul către Wix API
        const response = await axios.post('https://www.skywardflow.com/_functions/receiveLeadFromScraper', lead, {
            headers: { 'Content-Type': 'application/json' }
        });

        console.log("✅ Lead trimis către Wix:", response.data);
        res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        console.error("❌ Eroare la trimiterea leadului:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Skyward Scraper live on port ${PORT}`);
});
