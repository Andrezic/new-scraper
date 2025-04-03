const fetch = require("node-fetch");

async function trimiteLead() {
  try {
    const raspuns = await fetch("https://www.skywardflow.com/_functions/receiveLeadFromScraper", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        numeClient: "Ion Popescu",
        emailClient: "ionpopescu@example.com",
        cerereClient: "Aș dori servicii AI pentru gestionarea recenziilor online.",
        dataGenerarii: new Date(),
        status: "Nou",
        firmaId: "test-user-id"
      })
    });

    const rezultat = await raspuns.json();
    console.log("📬 Răspuns de la Wix:", rezultat);
  } catch (err) {
    console.error("❌ Eroare la trimiterea leadului:", err.message);
  }
}

trimiteLead();
