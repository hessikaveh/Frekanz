// One-off cleaning script for data/german-level-*.json.
// Removes entries with no educational value: truncated/garbled sentences,
// ad/boilerplate noise, times & scores instead of words, untranslated lines,
// duplicates, and person/brand names as vocabulary targets.
//
// Usage: bun scripts/clean-data.mjs [--dry-run]
// Writes cleaned files back in place and a removal report to clean-report.txt.

import { writeFileSync } from "node:fs";

const DRY_RUN = process.argv.includes("--dry-run");

// Common German/international first names used to spot full names in context.
const FIRST_NAMES = new Set(
  `Anna Bernd Christian Claus Daniel Dieter Dirk Frank Franka Friedrich Georg Hans
   Heidi Heinrich Helga Herbert Hermann Ingrid Jan Jens Jürgen Jörg Karen Karl
   Karin Klaus Kristin Leonie Lukas Manuel Maria Marion Martin Matthias Michael
   Monika Nicole Norbert Oliver Otto Peter Petra Ralf Sabine Sebastian Stefan
   Steffen Susanne Sven Thomas Timo Tobias Ulrich Uli Uwe Werner Wolfgang Angela
   Andrea Andreas Angela Anja Birgit Britta Christoph Claudia Dennis Doris Ernst
   Erika Franz Franziska Gabriele Gerhard Gudrun Gunter Hanna Heike Horst Hubert
   Johannes Jonas Jutta Kay Kerstin Kevin Lars Lea Lena Lisa Manfred Marco Marcus
   Mario Melanie Nadia Nadine Nico Nina Pascal Paul Philipp Renate Robert Rolf
   Rosemarie Ruth Sarah Silvia Simon Sonja Swen Tanja Thorsten Tim Toni Torsten
   Tracy Ursula Vanessa Vera Veronika Victoria Vincent Wilfried Wilhelmine
   Alexander Alexis Alice Alois Amir Andre Andrej Angelika Anke Anne Annette
   Anton Armin Astrid Axel Benjamin Benjamin Bettina Bianca Boris Brigitte Carl
   Charlotte Cindy David Deborah Dennis Dominik Eberhard Edgar Edith Eduard
   Ekkehard Elias Elisabeth Ella Emil Emilia Erdmuthe Erik Erwin Ewald Fabian
   Felix Ferdinand Finn Finnja Francesca Fred Freddy Friedhelm Fritz Fynn Gerrit
   Gilbert Gina Gisela Gregor Grete Gustav Hanne Harald Hartmut Hedwig Heiner
   Hella Hendrik Henning Henry Heribert Hildegard Holger Ina Ingeborg Iris Ivan
   Jacob Jakob Janina Jasmin Jenny Joachim Johanna Josephine Judith Julia Julius
   Justin Kai Karsten Katrin Ken Kim Klaudia Konrad Kraig Kurt Leif Leo Leon
   Leonora Lilly Linda Lorenz Louis Luca Lucie Ludwig Marie Marianne Marius
   Marlene Martina Max Maximilian Mehmet Melinda Michelle Mike Milena Mirco
   Miriam Moritz Nancy Naomi Natalie Nico Nils Noah Norman Oskar Patricia
   Patrick Paula Peggy Percy Pia Rainer Ramona Randy Rebecca Regina René Rico
   Rita Roger Roland Romina Ronald Roswitha Roy Ruby Sandra Saskato Scarlett
   Shelby Siegfried Sieglinde Sigrid Silke Sina Sinje Stefanía Stephan Stevie
   Svenja Sydney Tessa Thies Til Tina Tristan Udo Ulf Ulrike Vadim Valentin
   Valentina Veit Viktor Vitali Vivien Waldemar Walli Warren Wencke Wendy Wiebke
   Wilhelm William Xaver Yasmin Yvonne Zack Zara Zoe`
    .split(/\s+/)
    .filter(Boolean)
);

const TITLE =
  "(?:Herrn?|Frau|Dr\\.|Prof\\.|Professor(?:in)?|Doktor|Präsident(?:in)?|Minister(?:präsident(?:in)?)?|Kanzler(?:in)?|Bürgermeister(?:in)?|Trainer(?:in)?|Coach|Sprecher(?:in)?|Chef(?:in)?|Boss|Sänger(?:in)?|Schauspieler(?:in)?|Autor(?:in)?|Autorin|Regisseur(?:e|in)?|Musiker(?:in)?|Komponist(?:in)?|Maler(?:in)?|Dichter(?:in)?|Schriftsteller(?:in)?|Physiker(?:in)?|Politiker(?:in)?|Bischof|Papst|Kardinal|Moderator(?:en|in)?|Journalist(?:en|in)?|Stars?|Superstars?|Ex-\\S+)";

// Club names that are unambiguous brands (never ordinary vocabulary).
const CLUB_STRONG =
  /(^|\s)(((1|2)\.\s*)?(FC|FSV|SpVgg|Vf[BLE]|TSV|SSV)|Borussia|Schalke|Werder|Hertha|Dynamo|Arminia|Alemannia|Hansa|Pauli)|Bundesliga/i;
// City names that double as club names: only junk in a sports context.
const CLUB_CITY =
  /(?:^|\s)(?:Bayern|Hannover|Freiburg|Augsburg|Mainz|Energie|Leverkusen|Mönchengladbach)(?:\s|$)/i;
const SPORTS_CONTEXT =
  /\d+\s*[:–-]\s*\d+|Bundesliga|tritt\b|gewinnt|verliert|Spieltag|Tabellen|Klub|Verein|Match|Spiel\b|Saison|Elfmeter|Trainer/i;

// Well-known brands/companies that appear as vocabulary items.
const BRANDS = new Set(
  `Samsung Google Apple Amazon Microsoft Facebook Instagram WhatsApp Twitter
   Youtube Netflix Spotify Tesla Nokia Siemens Telekom Vodafone Skype Huawei
   Xiaomi Lenovo Intel Nvidia Yahoo Paypal Ebay Tiktok Snapchat Linkedin
   Pinterest Telegram Twitch Discord BMW Volkswagen Audi Porsche Opel Mercedes
   Lufthansa Ryanair Aldi Lidl Rossmann Adidas Nike Puma Ikea Mediamarkt Saturn
   Bosch Miele Krupp Thyssenkrupp SAP DHL DPD Postbank Commerzbank Coinbase
   Binance`
    .split(/\s+/)
    .filter(Boolean)
    .map((b) => b.toLowerCase())
);

function isJunkSentence(s) {
  if (/(https?:\/\/|www\.|\w+\.(?:com|de|net|org|info)\b)/i.test(s)) return "url-in-sentence";
  if (/yyyy|xxxx/i.test(s)) return "placeholder";
  if (/…/.test(s)) return "truncated-ellipsis";
  if (/\.\.\.(?!\s*$)/.test(s)) return "truncated-ellipsis";
  if (/wikipedia|diskussion:|benutzer:|kategorie:|datei:|dieser artikel|diese seite/i.test(s)) return "boilerplate";
  const letters = (s.match(/[a-zA-ZäöüßÄÖÜ]/g) || []).length;
  if (letters < 8 || letters < s.replace(/\s/g, "").length * 0.45) return "not-enough-letters";
  if (s.length < 15) return "sentence-too-short";
  return null;
}

function isBadTargetWord(word, sentence) {
  if (/^\d+([.:]\d+)*$/.test(word)) return "time-or-number"; // "16.30", "10.000"
  if (/^[\d.,%\s]+$/.test(word)) return "time-or-number";
  if (/^(?:https?:\/\/|www\.)\S+$/.test(word)) return "url";
  if (/\.(de|com|net|org|info)$/i.test(word)) return "domain-as-word"; // "Presseportal.de"
  if (word.length >= 3 && word === word.toUpperCase() && /[A-ZÄÖÜ]/.test(word)) return "all-caps-brand"; // "SPIEGEL"
  if (!/[aeiouäöüAEIOUÄÖÜ]/.test(word) && word.length <= 8) return "no-vowels"; // "SpVgg"
  if (/GmbH$|mbH$|Inc\.?$|Corp\.?$/i.test(word)) return "company"; // "... GmbH", "... Inc"
  if (BRANDS.has(word.toLowerCase())) return "brand"; // "Samsung"
  if (CLUB_STRONG.test(word)) return "sports-club"; // "FC Bayern", "2. Bundesliga"
  if (CLUB_CITY.test(word) && SPORTS_CONTEXT.test(sentence)) return "sports-club";
  // Full name in sentence: "<Title>/<First> <Word>" — only if the word is
  // capitalized there (avoids verbs like "Coach fährt ...").
  const re = new RegExp(`(?:${TITLE}|${[...FIRST_NAMES].join("|")})\\s+${escapeRe(word)}\\b`);
  if (/^[A-ZÄÖÜ]/.test(word) && re.test(sentence)) return "person-name-in-context";
  return null;
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const report = [];
const seen = new Set();
let keptTotal = 0;

for (let lv = 1; lv <= 7; lv++) {
  const file = `data/german-level-${lv}.json`;
  const posts = await Bun.file(file).json();
  const kept = [];

  for (const p of posts) {
    let reason = isJunkSentence(p.sentence);
    if (!reason && p.translation.trim() === p.sentence.trim()) reason = "untranslated";
    if (!reason) reason = isBadTargetWord(p.word, p.sentence);
    if (!reason) {
      const key = `${p.word.toLowerCase()}|${p.sentence}`;
      if (seen.has(key)) reason = "duplicate";
      else seen.add(key);
    }

    if (reason) {
      report.push({ level: lv, reason, word: p.word, sentence: p.sentence.slice(0, 90), slug: p.slug });
    } else {
      kept.push(p);
    }
  }

  console.log(`level ${lv}: ${posts.length} -> ${kept.length}`);
  keptTotal += kept.length;
  if (!DRY_RUN) writeFileSync(file, JSON.stringify(kept));
}

console.log(`total kept: ${keptTotal}, removed: ${report.length}`);
writeFileSync(
  "clean-report.txt",
  report.map((r) => `[L${r.level}] (${r.reason}) "${r.word}" :: ${r.sentence}`).join("\n")
);
console.log("report written to clean-report.txt");
