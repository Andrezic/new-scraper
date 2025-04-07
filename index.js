const express = require('express');
const axios = require('axios');
const { generateLeadUsingOpenAI } = require('./utils/openai');

const app = express();
app.use(express.json());

// Endpoint-ul principal pentru generare lead
app.post('/genereaza', async (req, res) => {
  const firmaData = req.body;

  console.log('📥 Date primite de la dashboard:', firmaData);

  if (!firmaData || !firmaData.firmaId || !firmaData.firmaNume || !firmaData.firmaServicii) {
    console.error('❌ Date lipsă pentru generarea leadului.');
    return res.status(400).json({ success: false, error: 'Incomplete firma data' });
  }

  try {
    // Trimitem datele din profilul firmei către OpenAI
    const leadGenerat = await generateLeadUsingOpenAI(firmaData);
    console.log('✅ Lead generat de AI:', leadGenerat);

    // Trimitem lead-ul generat către API-ul Wix
    const response = await axios.post('https://www.skywardflow.com/_functions/receiveLeadFromScraper', leadGenerat);

    if (response.data && response.data.success) {
      console.log('✅ Lead trimis cu succes către Wix CMS:', response.data);
      res.json({ success: true, data: response.data });
    } else {
      console.error('❌ Eroare la trimiterea leadului către Wix:', response.data);
      res.status(500).json({ success: false, error: 'Wix API error' });
    }
  } catch (error) {
    console.error('❌ Eroare generală la generarea sau trimiterea leadului:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Pornim serverul
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Skyward Scraper live on port ${PORT}`);
});
