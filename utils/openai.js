// utils/openai.js

function generatePrompt(firma) {
  return `
Firma: ${firma.firmaNume}
Servicii oferite: ${firma.firmaServicii}
Avantaje: ${firma.avantaje || "Nespecificat"}
Prețuri: ${firma.preturi || "Nespecificat"}
Telefon: ${firma.firmaTelefon}
Email: ${firma.firmaEmail}

🎯 Scop: Găsește un potențial client interesat de serviciile menționate mai sus. Generează o cerere realistă, ca și cum clientul ar căuta aceste servicii.
Scrie textul ca și cum clientul cere oferta.

Cererea clientului:
`;
}

module.exports = { generatePrompt };
