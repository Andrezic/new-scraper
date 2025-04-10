const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// 🔑 URL-ul endpointului Wix Studio (http-functions.jsw)
const WIX_API_URL = 'https://www.skywardflow.com/_functions/leadHandler';

// 🔑 Cheia secretă definită în Wix Secrets Manager
const SECRET_KEY = 'xyz123-super-secret'; // Verifică să fie exact valoarea din Secrets Manager

// 🧩 Ruta pentru trimitere lead-uri
app.post('/genereazaLead', async (req, res) => {
  try {
    const lead = req.body; // Preluăm datele primite din scraper

    console.log('📥 Lead primit pentru procesare:', lead);

    const leadData = {
      numeclient: lead.clientNameText,
      emailclient: lead.clientEmailText,
      cerereclient: lead.clientRequestText,
      firmaid: "skywardflow", // Poți adăuga aici firma din scraper, dacă o ai
      datagenerarii: lead.dataText,
      status: "activ"
    };

    console.log('🔄 Trimit lead către Wix:', leadData);

    const response = await axios.post(WIX_API_URL, leadData, {
      headers: {
        'X-Custom-Auth': SECRET_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Lead salvat cu succes în Wix:', response.data);
    res.status(200).json({ success: true, data: response.data });

  } catch (error) {
    console.error('❌ Eroare la trimiterea lead-ului:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
});

// ✅ Pornim serverul Hetzner
app.listen(3000, () => {
  console.log('🚀 Server Hetzner live pe portul 3000');
});
