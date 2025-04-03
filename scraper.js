// ✅ scraper.js – cod Node.js pentru extragerea leadurilor relevante

import express from "express";
import axios from "axios";
import * as dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const sources = [
  "https://www.reddit.com/r/Entrepreneur.json",
  "https://www.reddit.com/r/smallbusiness.json",
  "https://www.reddit.com/r/startups.json"
];

// ✅ Funcție pentru extragerea postărilor
async function fetchPosts() {
  const allPosts = [];
  for (const url of sources) {
    try {
      const response = await axios.get(url, {
        headers: { "User-Agent": "SkywardBot/1.0" }
      });
      const posts = response.data.data.children.map(p => p.data);
      allPosts.push(...posts);
    } catch (err) {
      console.error("Eroare la fetch din:", url);
    }
  }
  return allPosts;
}

// ✅ Filtrare cu AI (bazat pe datele din profil firmă)
async function filterWithAI(posts, profilFirma) {
  const matches = [];
  for (const post of posts) {
    const prompt = `Profil firmă: ${profilFirma}.\n\nPostare client: ${post.title} - ${post.selftext}\n\nAceastă postare este un potențial lead pentru firmă? Răspunde doar cu DA sau NU.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }]
    });

    const decision = response.choices[0].message.content.trim().toUpperCase();
    if (decision === "DA") {
      matches.push({
        numeClient: post.author,
        emailClient: "thisistestmail2025@gmail.com",
        cerereClient: post.title,
        sursa: `https://reddit.com${post.permalink}`
      });
    }
  }
  return matches;
}

// ✅ Endpoint principal
app.get("/scrape", async (req, res) => {
  const profilFirma = req.query.profil || "O firmă care oferă servicii AI pentru afaceri mici";
  const posts = await fetchPosts();
  const leads = await filterWithAI(posts, profilFirma);
  res.json(leads);
});

app.listen(port, () => {
  console.log(`✅ Skyward Scraper live on port ${port}`);
});
