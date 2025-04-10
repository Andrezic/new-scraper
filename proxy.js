const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// 🔗 URL-ul frontend Wix Studio — pagina publică pe care o ai deja
const WIX_PUBLIC_URL = 'https://www.skywardflow.com/date-firma'; // Schimbă cu pagina publică a formularului tău

app.post('/trimite-lead', async (req, res) => {
  try {
    const lead = req.body;

    console.log('📥 Lead primit pentru trimitere:', lead);

    const response = await axios.post(WIX_PUBLIC_URL, lead, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Lead trimis către Wix frontend:', response.data);
    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error('❌ Eroare la trimiterea către frontend Wix:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
});

app.listen(4000, () => {
  console.log('🚀 Skyward Proxy server rulează pe portul 4000');
});
