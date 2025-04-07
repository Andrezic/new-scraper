const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/genereaza', async (req, res) => {
  const { firmaId } = req.body;

  if (!firmaId) {
    console.error("❌ Nu am primit firmaId în cerere:", req.body);
    return res.status(400).json({ success: false, error: "FirmaId lipsă" });
  }

  console.log("✅ Am primit cererea de generare lead pentru firma:", firmaId);

  try {
    // 📦 Cerere la API-ul Wix pentru profil firmă
    const profilFirmaResponse = await axios.post('https://www.skywardflow.com/_functions/getProfilFirma', { firmaId });

    if (!profilFirmaResponse.data || !profilFirmaResponse.data.success) {
      console.error("❌ Nu am putut obține datele firmei din Wix:", profilFirmaResponse.data);
      return res.status(500).json({ success: false, error: "Nu am putut obține datele firmei din Wix" });
    }

    const firma = profilFirmaResponse.data.firma;

    // 🧠 Generăm lead cu AI + datele reale ale firmei
    const leadData = {
      numeClient: "Client interesat AI",
      emailClient: "thisistestmail2025@gmail.com",
      cerereClient: `Bună! Sunt interesat de serviciile: ${firma.servicii}. Avantaje: ${firma.avantaje}. Preturi: ${firma.preturi}`,
      firmaId: firmaId
    };

    const wixResponse = await axios.post('https://www.skywardflow.com/_functions/receiveLeadFromScraper', leadData);

    if (wixResponse.data.success) {
      console.log("✅ Lead trimis cu succes la Wix:", wixResponse.data);
      res.json({ success: true });
    } else {
      console.error("❌ Eroare la trimiterea leadului către Wix:", wixResponse.data);
      res.status(500).json({ success: false, error: "Eroare la trimiterea leadului către Wix" });
    }
  } catch (error) {
    console.error("❌ Eroare generală la procesarea cererii:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Skyward Scraper live on port ${PORT}`);
});
