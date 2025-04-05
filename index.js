const express = require('express');
const bodyParser = require('body-parser');
const { genereazaLeadCuOpenAI } = require('./utils/openai');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());

app.post('/genereaza', async (req, res) => {
  try {
    const profil = req.body;

    console.log('✅ Profil primit de la Wix:', profil);

    // Verificare câmpuri necesare
    if (!profil.numeFirma || !profil.emailFirma || !profil.servicii) {
      return res.status(400).json({ success: false, error: 'Date incomplete primite din Wix' });
    }

    // Generează lead nou cu OpenAI
    const leadGenerat = await genereazaLeadCuOpenAI(profil);

    console.log('✅ Lead generat:', leadGenerat);

    // Trimitem leadul înapoi în Wix
    const response = await fetch('https://www.skywardflow.com/_functions/receiveLeadFromScraper', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        numeClient: leadGenerat.numeClient,
        emailClient: leadGenerat.emailClient,
        cerereClient: leadGenerat.cerereClient,
        firmaId: profil.firmaId // acesta vine din Wix ProfilFirme
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Eroare la trimiterea leadului:', data);
      return res.status(500).json({ success: false, error: 'Eroare la trimiterea leadului în Wix' });
    }

    console.log('✅ Lead trimis cu succes în Wix:', data);
    res.json({ success: true, data });
  } catch (error) {
    console.error('❌ Eroare generală în scraper:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Skyward Scraper live on port ${PORT}`);
});
