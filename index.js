const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { generateLead } = require('./utils/openai');

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

app.post('/genereaza', async (req, res) => {
  const firma = req.body;

  if (!firma || !firma.firmaId) {
    console.error('❌ Date incomplete primite:', firma);
    return res.status(400).json({ success: false, error: 'Date incomplete primite.' });
  }

  try {
    const lead = await generateLead(firma);
    console.log('✅ Lead generat:', lead);

    const response = await fetch('https://www.skywardflow.com/_functions/receiveLeadFromScraper', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });

    const responseBody = await response.text();
    console.log('📨 Răspuns Wix:', responseBody);

    res.json({ success: true, message: 'Lead generat și trimis!' });
  } catch (error) {
    console.error('❌ Eroare la procesarea leadului:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`✅ Skyward Scraper live on port ${port}`);
});
