// Generates German grammar fill-in-the-blank MCQ exercises from Tatoeba.
//
// Data sources & licensing:
//   - Sentences: Tatoeba full export (sentences_detailed.csv), default license
//     CC BY 2.0 FR. Attribution REQUIRED: each exercise stores its sentence
//     author ('author' field) and the app displays a visible Tatoeba credit.
//     Do NOT switch to sentences.csv — it lacks the author field.
//   - Verb morphology (conjugation/tense topics): UniMorph deu
//     (https://github.com/unimorph/deu), license CC BY-SA 3.0. The paradigm
//     tables are factual data used to compute distractors; credit UniMorph
//     in the app alongside Tatoeba.
//
// Usage: bun scripts/generate-grammar-data.mjs
//   Env: TATOEBA_DIR, UNIMORPH_FILE. Writes data/grammar-*.json.

import { writeFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { createReadStream } from "node:fs";

const TATOEBA_DIR =
  process.env.TATOEBA_DIR ??
  "/var/folders/8g/6c8yw52s61q2spb2xtj6ph4m0000gn/T/opencode/tatoeba";
const UNIMORPH_FILE =
  process.env.UNIMORPH_FILE ??
  "/var/folders/8g/6c8yw52s61q2spb2xtj6ph4m0000gn/T/opencode/unimorph/deu.csv";

const LICENSE_META = {
  source: "Tatoeba (https://tatoeba.org)",
  license: "CC BY 2.0 FR (https://creativecommons.org/licenses/by/2.0/fr/deed.en)",
  sourceUrl: "https://downloads.tatoeba.org/exports/",
  morphologySource:
    "UniMorph deu (https://github.com/unimorph/deu), CC BY-SA 3.0",
  note: "Sentence authors are credited per exercise via the 'author' field. CC BY requires attribution — keep author credits and the Tatoeba credit visible in the app.",
};

const MIN_TOKENS = 4;
const MAX_TOKENS = 12;

// ---------------------------------------------------------------------------
// Topic definitions
//
// kind: "words"      – mask a member of a closed word class; distractors are
//                      other members of the SAME class (tests selection).
//                      Only classes whose answer is unambiguous given the
//                      English translation are included.
// kind: "adjending"  – mask an inflected adjective between determiner and
//                      noun; distractors are ending-swapped variants.
// kind: "morph"      – mask a finite/subjunctive verb form identified via
//                      UniMorph; distractors are OTHER forms of the same
//                      lemma (tests agreement/tense/mood).
// ---------------------------------------------------------------------------

const DEFINITE = ["der", "die", "das", "den", "dem", "des"];
const INDEFINITE = ["ein", "eine", "einen", "einem", "einer", "eines"];

// Finite present-tense forms of the six core modal verbs.
const MODALS = ["können", "müssen", "dürfen", "wollen", "sollen", "mögen"];
// haben/sein finite forms — the Perfect-tense auxiliary choice.
const PERFECT_AUX = [
  "habe", "hast", "hat", "haben", "habt",
  "bin", "bist", "ist", "sind", "seid",
  "hatte", "hatten", "hattest", "war", "warst", "waren", "wart",
];
const PARTICIPLE_RE = /\bge[a-zäöüß]{2,}(t|en)\b|\bworden\b/;
// Correlative pairs: the partner earlier in the sentence uniquely determines
// the answer ("entweder ... oder", "nicht nur ... sondern", ...).
const CORRELATIVE_PARTNERS = {
  oder: "entweder",
  noch: "weder",
  sondern: "nicht nur",
  desto: "^je\\b",
  als: "sowohl",
};

const TOPIC_DEFS = [
  {
    slug: "definite-articles",
    topic: "Definite articles",
    description: 'der / die / das / den / dem / des — choose the right form of "the"',
    cefrLevel: "A1",
    kind: "words",
    words: DEFINITE,
    maxPerWord: 100,
    maxItems: 400,
  },
  {
    slug: "indefinite-articles",
    topic: "Indefinite articles",
    description: 'ein / eine / einen / einem / einer / eines — choose the right form of "a"',
    cefrLevel: "A1",
    kind: "words",
    words: INDEFINITE,
    maxPerWord: 100,
    maxItems: 400,
  },
  {
    slug: "personal-pronouns",
    topic: "Personal pronouns",
    description: "ich / du / er / wir / ihr — who is being talked about?",
    cefrLevel: "A1",
    kind: "words",
    // "sie" and "es" excluded: ambiguous with formal "Sie"/dummy subjects.
    words: ["ich", "du", "er", "wir", "ihr"],
    maxPerWord: 90,
    maxItems: 400,
  },
  {
    slug: "question-words",
    topic: "Question words",
    description: "wer / was / wann / wo / warum — asking the right question",
    cefrLevel: "A1",
    kind: "words",
    // "wie" excluded: it also means "like/as" in comparisons.
    words: ["wer", "was", "wann", "wo", "warum"],
    maxPerWord: 100,
    maxItems: 400,
  },
  {
    slug: "possessives",
    topic: "Possessives",
    description: "mein / dein / sein / ihr / unser / euer — whose is it?",
    cefrLevel: "A2",
    kind: "words",
    // Masked only directly before a noun (capitalized follower), otherwise
    // "sein" is usually the verb "to be".
    words: ["mein", "dein", "unser", "euer"],
    nounFollowerOnly: true,
    maxPerWord: 70,
    maxItems: 300,
  },
  {
    slug: "negation",
    topic: "Negation",
    description: "nicht vs. kein / keine / keinen — how to say \"not\" and \"no\"",
    cefrLevel: "A2",
    kind: "words",
    words: ["nicht", "kein", "keine", "keinen", "keinem", "keiner", "keines"],
    maxPerWord: 60,
    maxItems: 300,
  },
  {
    slug: "pronoun-cases",
    topic: "Pronoun cases",
    description: "mich / mir / dich / dir / ihn / ihm — accusative or dative?",
    cefrLevel: "B1",
    kind: "words",
    words: ["mich", "mir", "dich", "dir", "ihn", "ihm", "ihnen", "uns", "euch"],
    maxPerWord: 50,
    maxItems: 300,
  },
  {
    slug: "prepositions",
    topic: "Prepositions",
    description: "mit / ohne / für / gegen / während — small words, big meaning",
    cefrLevel: "B1",
    kind: "words",
    // Location preps (in/an/auf) excluded: several answers often fit, which
    // makes broken multiple-choice questions. Meaning-distinct preps only.
    words: ["mit", "ohne", "für", "gegen", "durch", "um", "aus", "bei", "nach", "seit", "während", "wegen", "trotz"],
    synonymGroups: [["wegen", "trotz"], ["während", "seit"]],
    maxPerWord: 40,
    maxItems: 300,
  },
  {
    slug: "konnektoren",
    topic: "Connectors",
    description: "weil / deshalb / trotzdem / obwohl — linking ideas together",
    cefrLevel: "B1",
    kind: "words",
    words: ["weil", "denn", "deshalb", "deswegen", "daher", "trotzdem", "obwohl", "sondern", "außerdem", "dennoch", "somit"],
    // Causal/concessive adverbs are mutually interchangeable; never pit
    // them against each other in one question.
    synonymGroups: [
      ["deshalb", "deswegen", "daher", "somit"],
      ["trotzdem", "dennoch"],
    ],
    maxPerWord: 40,
    maxItems: 300,
  },
  {
    slug: "passive-auxiliaries",
    topic: "Passive voice",
    description: "wird / wurde / würden — the engine of the German passive",
    cefrLevel: "B2",
    kind: "words",
    words: ["wird", "werde", "wirst", "wurde", "wurden", "würde", "würden"],
    // Only mask when a real Partizip II follows nearby ("wird gebaut"),
    // not an infinitive ("wird gehen" = active future).
    filter: (tokens, index) => {
      const window = tokens.slice(index + 1, index + 7).join(" ").toLowerCase();
      return /\bge[a-zäöüß]{2,}(t|en)\b|\bworden\b/.test(window);
    },
    maxPerWord: 45,
    maxItems: 250,
  },
  {
    slug: "perfect-auxiliaries",
    topic: "Perfect auxiliaries",
    description: "haben oder sein? — Perfekt & Plusquamperfekt auxiliary choice",
    cefrLevel: "A2",
    kind: "words",
    words: PERFECT_AUX,
    // Only meaningful directly before a Partizip II.
    filter: (tokens, index) =>
      // Window of 4: keeps "Ich habe mich immer gefragt" but rejects
      // copulas whose participle sits in a distant subordinate clause.
      PARTICIPLE_RE.test(tokens.slice(index + 1, index + 5).join(" ").toLowerCase()),
    synonymGroups: [],
    maxPerWord: 30,
    maxItems: 300,
  },
  {
    slug: "modal-verbs",
    topic: "Modal verbs",
    description: "kann / muss / darf / will — what are you able or obliged to do?",
    cefrLevel: "A2",
    kind: "modal",
    maxPerLemma: 40,
    maxItems: 300,
  },
  {
    slug: "participles",
    topic: "Past participles",
    description: "gemacht / gegangen / geschrieben — the Perfekt engine",
    cefrLevel: "B1",
    kind: "ptcp",
    maxPerLemma: 1,
    maxItems: 300,
  },
  {
    slug: "contractions",
    topic: "Contractions",
    description: "zum / zur / im / am — preposition + article in one word",
    cefrLevel: "A2",
    kind: "words",
    words: ["im", "am", "zum", "zur", "beim", "vom", "ins", "ans", "aufs", "fürs"],
    maxPerWord: 50,
    maxPerWord: 40,
    maxItems: 250,
  },
  {
    slug: "demonstratives",
    topic: "Demonstratives",
    description: "dieser / diese / dieses / diesen — pointing at things",
    cefrLevel: "B1",
    kind: "words",
    words: ["dieser", "diese", "dieses"],
    // Extra forms used ONLY as distractors (never the answer).
    extraDistractors: ["diesen", "diesem", "jener", "jene"],
    nounFollowerOnly: true,
    maxPerWord: 60,
    maxItems: 250,
  },
  {
    slug: "superlatives",
    topic: "Superlatives",
    description: "am größten / am schnellsten — comparing at the top",
    cefrLevel: "B1",
    kind: "degree",
    maxPerWord: 25,
    maxItems: 200,
  },
  {
    slug: "correlative-pairs",
    topic: "Correlative pairs",
    description: "entweder … oder / nicht nur … sondern / weder … noch",
    cefrLevel: "B2",
    kind: "words",
    words: Object.keys(CORRELATIVE_PARTNERS),
    filter: (tokens, index, answer) => {
      const partner = CORRELATIVE_PARTNERS[answer];
      if (!partner) return false;
      return new RegExp(`\\b${partner}\\b`, "i").test(
        tokens.slice(0, index).join(" ")
      );
    },
    maxPerWord: 60,
    maxPerWord: 35,
    maxItems: 150,
  },
  {
    slug: "advanced-connectors",
    topic: "Advanced connectors",
    description: "indem / sodass / zumal / hierdurch — fine-grained logical links",
    cefrLevel: "C1",
    kind: "words",
    words: ["indem", "sodass", "obschon", "zumal", "hierdurch", "dadurch", "mithin", "ferner"],
    // Dangling "dadurch" without its "dass"-clause is meaningless.
    filter: (tokens, index) =>
      !["dadurch", "hierdurch"].includes(
        tokens[index].replace(/[.,;:!?„“"()]/g, "").toLowerCase()
      ) || /\bdass\b/.test(tokens.join(" ")),
    maxPerWord: 25,
    maxItems: 150,
  },
  {
    slug: "present-conjugation",
    topic: "Present tense",
    description: "gehe / gehst / geht — pick the form that agrees",
    cefrLevel: "A2",
    kind: "morph",
    featsTest: (f) => /^V;IND;(SG|PL);\d;PRS$/.test(f),
    distractorTest: (f) => /^V;IND;(SG|PL);\d;PRS$/.test(f),
    minLemmaLength: 3,
    rejectAuxBefore: true,
    maxPerLemma: 12,
    maxItems: 400,
  },
  {
    slug: "past-tense",
    topic: "Past tense",
    description: "ging / gingst / gingen — narrative Präteritum forms",
    cefrLevel: "B1",
    kind: "morph",
    featsTest: (f) => /^V;IND;(SG|PL);\d;PST$/.test(f),
    // Contrast against present forms too: tests tense recognition.
    distractorTest: (f) => /^V;IND;(SG|PL);\d;(PRS|PST)$/.test(f),
    minLemmaLength: 3,
    rejectAuxBefore: true,
    maxPerLemma: 12,
    maxItems: 350,
  },
  {
    slug: "konjunktiv-ii",
    topic: "Konjunktiv II",
    description: "wäre / hätte / könnte — wishes, hypotheses, politeness",
    cefrLevel: "B2",
    kind: "morph",
    featsTest: (f) => /^V;SBJV;(SG|PL);\d;PST$/.test(f),
    distractorTest: (f) => /^(V;IND;(SG|PL);\d;(PRS|PST)|V;SBJV;(SG|PL);\d;PST)$/.test(f),
    minLemmaLength: 2,
    rejectAuxBefore: true,
    maxPerLemma: 15,
    maxItems: 300,
  },
  // NOTE: Konjunktiv I (C1) was attempted but dropped: surface-form lookup
  // cannot reliably identify reported-speech contexts, and the audit found
  // ~95% of generated items broken. Requires hand-authored content.
  {
    slug: "adjective-endings",
    topic: "Adjective endings",
    description: "ein groß__ Haus — weak/mixed/strong declension",
    cefrLevel: "B1",
    kind: "adjending",
    maxItems: 300,
  },
];

// ---------------------------------------------------------------------------
// Data loading
// ---------------------------------------------------------------------------

async function readTsv(path, onRow) {
  const rl = createInterface({ input: createReadStream(path), crlfDelay: Infinity });
  for await (const line of rl) onRow(line.split("\t"));
}

// id -> { text, author }
const deu = new Map();
const eng = new Map();
await readTsv(`${TATOEBA_DIR}/sentences_detailed.csv`, ([id, lang, ...rest]) => {
  const username = rest[rest.length - 3];
  const text = rest.slice(0, rest.length - 3).join("\t");
  if (lang === "deu") deu.set(id, { text, author: username });
  else if (lang === "eng") eng.set(id, { text });
});
console.log(`sentences: ${deu.size} de, ${eng.size} en`);

const pairs = [];
await readTsv(`${TATOEBA_DIR}/links.csv`, ([a, b]) => {
  if (deu.has(a) && eng.has(b)) pairs.push([a, b]);
  else if (deu.has(b) && eng.has(a)) pairs.push([b, a]);
});
console.log(`de-en pairs: ${pairs.length}`);

// UniMorph format: lemma \t inflected form \t feature bundle.
// Build: lowercase form -> [{lemma, feats}] for verbs, plus reverse
// lowercase lemma -> (form -> Set<feats>), plus a set of ALL forms
// (any POS) used to reject fabricated distractor words.
const morphIndex = new Map();
const lemmaForms = new Map();
const allForms = new Set();
{
  const rl = createInterface({ input: createReadStream(UNIMORPH_FILE), crlfDelay: Infinity });
  for await (const line of rl) {
    const cols = line.split("\t");
    if (cols.length < 3) continue;
    const [lemma, form, feats] = cols;
    const formKey = form.toLowerCase();
    allForms.add(formKey);
    if (!feats.startsWith("V")) continue; // verbs only
    const key = formKey;

    let arr = morphIndex.get(key);
    if (!arr) morphIndex.set(key, (arr = []));
    arr.push({ lemma, feats });

    const lemmaKey = lemma.toLowerCase();
    let forms = lemmaForms.get(lemmaKey);
    if (!forms) lemmaForms.set(lemmaKey, (forms = new Map()));
    let featSet = forms.get(key);
    if (!featSet) forms.set(key, (featSet = new Set()));
    featSet.add(feats);
  }
}
console.log(`UniMorph verb forms indexed: ${morphIndex.size}`);

// ---------------------------------------------------------------------------
// Extraction
// ---------------------------------------------------------------------------

// Balanced option selection: track how often every candidate word has been
// offered across a topic's exercises; always prefer the least-shown words.
// Without this, pure random sampling leaves some options rarely seen.
const distractorUsage = new Map();
function initDistractorTracking(slugs) {
  for (const slug of slugs) distractorUsage.set(slug, new Map());
}
function pickDistractors(slug, candidates, rand, n = 3) {
  const use = distractorUsage.get(slug);
  const sorted = [...candidates].sort(
    (a, b) => (use.get(a) ?? 0) - (use.get(b) ?? 0) || rand() - rand()
  );
  const picked = [];
  for (const c of sorted) {
    if (picked.length >= n) break;
    if (!picked.includes(c)) picked.push(c);
  }
  return picked;
}
function noteOptionsShown(slug, options) {
  const use = distractorUsage.get(slug);
  for (const w of options) use.set(w, (use.get(w) ?? 0) + 1);
}

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function baseSentenceChecks(text) {
  // Also rejects pre-1996 orthography and archaic spellings common in the
  // corpus ("mußt", "Wieviel", "beguckst") that confuse learners.
  return (
    !/\d|https?:|@|\p{Lu}{3,}/u.test(text) &&
    !/\bmußt\b|wieviel|beguck/i.test(text)
  );
}

function extractWordsExercise(id, text, translation, def) {
  if (!baseSentenceChecks(text)) return null;
  if (def.translationMust && !def.translationMust.test(translation)) return null;
  const tokens = text.split(/\s+/);
  if (tokens.length < MIN_TOKENS || tokens.length > MAX_TOKENS) return null;

  const words = new Set(def.words);
  const candidates = tokens
    .map((tok, i) => [tok.replace(/[.,;:!?„“"()]/g, ""), i])
    .filter(([tok]) => words.has(tok));
  if (candidates.length === 0) return null;

  const [answer, index] = candidates[0];
  if (index === 0) return null; // sentence-initial would leak via capitalization

  if (def.nounFollowerOnly) {
    const nextTok = (tokens[index + 1] ?? "").replace(/[.,;:!?„“"()]/g, "");
    if (!nextTok || !/^\p{Lu}/u.test(nextTok)) return null;
  }
  if (def.filter && !def.filter(tokens, index, answer)) return null;

  const before = tokens.slice(0, index).join(" ");
  const after = tokens.slice(index + 1).join(" ");
  if (!after || !/[a-zäöüß]/.test(after)) return null;

  // Never offer near-synonyms as competing options (e.g., deshalb vs.
  // deswegen, wegen vs. trotz) — both would be correct.
  const synonymsOfAnswer = new Set(
    (def.synonymGroups ?? [])
      .find((group) => group.includes(answer))
      ?.filter((w) => w !== answer) ?? []
  );
  const pool = def.words.filter((w) => w !== answer && !synonymsOfAnswer.has(w));

  const fullPool = [...pool, ...(def.extraDistractors ?? [])];

  const rand = mulberry32(Number(id));
  const distractors = pickDistractors(def.slug, fullPool, rand);
  if (distractors.length < 3) return null;

  const options = [...distractors, answer].sort(() => rand() - 0.5);
  return { id: `tat-${id}`, before, after, answer, options, translation };
}

const ADJ_SUFFIXES = ["e", "en", "er", "em", "es"];
const ARTICLE_SET = new Set([...DEFINITE, ...INDEFINITE]);

// Surface forms that are usually NOT verbs despite matching a UniMorph
// paradigm (homographs found by linguistic audit).
const NONVERB_ANSWERS = new Set([
  "heute", "bitte", "schade", "dunkel", "meine", "letzte", "komplizierte",
  "genau", "vielleicht", "gerne",
]);
// Lemmas whose inflections collide with common non-verb homographs.
const LEMMA_BLACKLIST = new Set(["meinen", "bitten", "schaden", "dunkeln", "heuen"]);
// Auxiliaries: if one precedes the masked verb, the "verb" is actually a
// participle/infinitive in a Perfekt/Futur construction, not finite.
const AUX_BEFORE = new Set([
  "habe", "hast", "hat", "hatte", "haben", "hattet", "hätten",
  "bin", "bist", "ist", "war", "sind", "waren", "seid",
  "werde", "wirst", "wird", "werden", "wurde", "wurden", "würde", "würden",
]);
const POSSESSIVE_FORMS = new Set(
  ["mein", "meine", "meinen", "meinem", "meiner", "meines",
   "dein", "deine", "deinen", "deinem", "deiner", "deines",
   "sein", "seine", "seinen", "seinem", "seiner", "seines",
   "ihr", "ihre", "ihren", "ihrem", "ihrer", "ihres",
   "unser", "unsere", "unseren", "unserem", "unserer", "unseres",
   "euer", "eure", "euren", "eurem", "eurer", "eures"]
);

// Repairs the case where the masked token was followed by a comma that our
// tokenizer stripped: "<blank> was ich sagen soll" -> "<blank>, was ...".
// Only unambiguous subordinators — inserting commas before der/die/das/wie
// would often be wrong.
const SUBORDINATOR_START =
  /^(was|wer|ob|wenn|weil|da\b|dass|wo|wann|warum|wieso|obwohl|indem|sodass)\b/;
function repairComma(item) {
  const first = item.after.split(/\s+/)[0]?.replace(/[.,;:!?„“"()]/g, "") ?? "";
  if (!/[.,;:!?„“"»]$/.test(item.before.trim()) && SUBORDINATOR_START.test(first)) {
    return { ...item, after: ", " + item.after };
  }
  return item;
}

function extractAdjEndingExercise(id, text, translation) {
  if (!baseSentenceChecks(text)) return null;
  const tokens = text.split(/\s+/);
  if (tokens.length < MIN_TOKENS || tokens.length > MAX_TOKENS) return null;

  for (let i = 1; i < tokens.length - 1; i++) {
    const prev = tokens[i - 1].replace(/[.,;:!?„“"()]/g, "").toLowerCase();
    const tok = tokens[i].replace(/[.,;:!?„“"()]/g, "");
    const next = tokens[i + 1].replace(/[.,;:!?„“"()]/g, "");
    if (!ARTICLE_SET.has(prev)) continue;
    if (!tok || tok[0] === tok[0].toUpperCase()) continue; // lowercase only
    if (tok.length < 5) continue;
    const suffix = ADJ_SUFFIXES.find(
      (s) => tok.endsWith(s) && tok.length - s.length >= 3
    );
    if (!suffix) continue;
    // Must precede a noun: German nouns are capitalized.
    if (!next || !/^\p{Lu}/u.test(next)) continue;

    const stem = tok.slice(0, tok.length - suffix.length);
    // Reject invariant particles ("ein bisschen"), possessive pronouns and
    // ordinals masquerading as inflected adjectives.
    if (
      stem === "bissch" ||
      POSSESSIVE_FORMS.has(tok) ||
      /^\w+ste(n|r|m|s)?$/.test(tok)
    )
      continue;
    const rand = mulberry32(Number(id));
    const distractors = ADJ_SUFFIXES
      .filter((s) => s !== suffix)
      .sort(() => rand() - 0.5)
      .slice(0, 3)
      .map((s) => stem + s);
    if (distractors.length < 3) continue;

    const options = [...distractors, tok].sort(() => rand() - 0.5);
    return {
      id: `tat-${id}`,
      before: tokens.slice(0, i).join(" "),
      after: tokens.slice(i + 1).join(" "),
      answer: tok,
      options,
      translation,
    };
  }
  return null;
}

function extractMorphExercise(id, text, translation, def) {
  if (!baseSentenceChecks(text)) return null;
  const tokens = text.split(/\s+/);
  if (tokens.length < MIN_TOKENS || tokens.length > MAX_TOKENS) return null;

  for (let i = 1; i < tokens.length; i++) {
    const rawTok = tokens[i].replace(/[.,;:!?„“"()]/g, "");
    if (!rawTok || rawTok[0] === rawTok[0].toUpperCase()) continue;
    const lower = rawTok.toLowerCase();
    if (NONVERB_ANSWERS.has(lower)) continue;

    // A preceding auxiliary means this token is a participle/infinitive
    // ("Ich habe mich entschieden"), not a finite form.
    if (def.rejectAuxBefore) {
      const prevWindow = tokens
        .slice(Math.max(0, i - 3), i)
        .map((t) => t.replace(/[.,;:!?„“"()]/g, "").toLowerCase());
      if (prevWindow.some((t) => AUX_BEFORE.has(t))) continue;
      if (tokens[i - 1].replace(/[.,;:!?„“"()]/g, "").toLowerCase() === "zu") continue;
      if (/lass(t)? uns/i.test(tokens.slice(Math.max(0, i - 2), i + 1).join(" "))) continue;
    }

    const entries = morphIndex.get(lower);
    if (!entries) continue;

    // Prefer an entry whose lemma differs from the surface form (a real
    // inflection, not the citation form).
    const match =
      entries.find((e) => def.featsTest(e.feats) && e.lemma.toLowerCase() !== lower) ??
      entries.find((e) => def.featsTest(e.feats));
    if (!match) continue;
    if (match.lemma.length < def.minLemmaLength) continue;
    if (LEMMA_BLACKLIST.has(match.lemma.toLowerCase())) continue;
    // Collect same-lemma forms matching the distractor spec.
    const lemmaKey = match.lemma.toLowerCase();
    const forms = lemmaForms.get(lemmaKey) ?? new Map();
    const distractorCandidates = [...forms.keys()].filter((form) => {
      for (const f of forms.get(form)) if (def.distractorTest(f)) return true;
      return false;
    });

    const rand = mulberry32(Number(id) ^ 0x5eed);
    const distractors = distractorCandidates
      .filter((f) => f !== rawTok.toLowerCase())
      .sort(() => rand() - 0.5)
      .slice(0, 3);
    if (distractors.length < 3) continue;

    const options = [...distractors, lower].sort(() => rand() - 0.5);
    return {
      id: `tat-${id}`,
      before: tokens.slice(0, i).join(" "),
      after: tokens.slice(i + 1).join(" "),
      answer: lower,
      options,
      translation,
      lemma: match.lemma,
    };
  }
  return null;
}

// Finite modal form matching an exact person/number feature string.
function formForLemma(lemmaLower, targetFeats) {
  const forms = lemmaForms.get(lemmaLower) ?? new Map();
  for (const [form, featSet] of forms) {
    if (featSet.has(targetFeats)) return form;
  }
  return null;
}

function extractModalExercise(id, text, translation) {
  if (!baseSentenceChecks(text)) return null;
  const tokens = text.split(/\s+/);
  if (tokens.length < MIN_TOKENS || tokens.length > MAX_TOKENS) return null;

  for (let i = 1; i < tokens.length; i++) {
    const rawTok = tokens[i].replace(/[.,;:!?„“"()]/g, "");
    if (!rawTok || rawTok[0] === rawTok[0].toUpperCase()) continue;
    const lower = rawTok.toLowerCase();
    const entries = morphIndex.get(lower);
    if (!entries) continue;

    const match = entries.find(
      (e) => MODALS.includes(e.lemma.toLowerCase()) && /V;IND;(SG|PL);\d;PRS/.test(e.feats)
    );
    if (!match) continue;

    // Distractors: the same person/number form of OTHER modal verbs,
    // chosen least-shown-first so all modals get equal exposure.
    const rand = mulberry32(Number(id) ^ 0x111);
    let modalForms = MODALS
      .filter((m) => m !== match.lemma.toLowerCase())
      .map((m) => formForLemma(m, match.feats))
      .filter((f) => Boolean(f) && f !== lower);
    // Permission-"may" translations: "kann" is arguably correct too —
    // never offer können against a dürfen answer.
    if (/\bmay\b/i.test(translation) && match.lemma.toLowerCase() === "dürfen") {
      modalForms = modalForms.filter((f) => !f.startsWith("kann"));
    }
    const distractors = pickDistractors("modal-verbs", modalForms, rand);
    if (distractors.length < 3) continue;

    const options = [...distractors, lower].sort(() => rand() - 0.5);
    return {
      id: `tat-${id}`,
      before: tokens.slice(0, i).join(" "),
      after: tokens.slice(i + 1).join(" "),
      answer: lower,
      options,
      translation,
      lemma: match.lemma,
    };
  }
  return null;
}

// Pool of all Partizip II forms — distractor source for participles.
const ptcpPool = [];
for (const [form, es] of morphIndex) {
  if (es.some((e) => e.feats.startsWith("V.PTCP;PST"))) ptcpPool.push(form);
}

// Participles that are mostly used adjectivally ("sind bekannt" = "are
// known/well-known") — not genuine Perfekt practice.
const ADJ_PARTICIPLES = new Set([
  "gewohnt", "ausgesetzt", "beunruhigt", "überrascht", "gespannt",
  "bekannt", "berechtigt", "ausgezeichnet", "einverstanden", "bereit",
]);

function extractPtcpExercise(id, text, translation) {
  if (!baseSentenceChecks(text)) return null;
  const tokens = text.split(/\s+/);
  if (tokens.length < MIN_TOKENS || tokens.length > MAX_TOKENS) return null;

  for (let i = 2; i < tokens.length; i++) {
    const rawTok = tokens[i].replace(/[.,;:!?„“"()]/g, "");
    if (!rawTok || rawTok[0] === rawTok[0].toUpperCase()) continue;
    const lower = rawTok.toLowerCase();

    // Must sit in a Perfekt/Passiv context (auxiliary nearby).
    const prevWindow = tokens
      .slice(Math.max(0, i - 3), i)
      .map((t) => t.replace(/[.,;:!?„“"()]/g, "").toLowerCase());
    if (!prevWindow.some((t) => AUX_BEFORE.has(t))) continue;

    const entries = morphIndex.get(lower);
    if (!entries?.some((e) => e.feats.startsWith("V.PTCP;PST"))) continue;
    if (ADJ_PARTICIPLES.has(lower)) continue;

    const rand = mulberry32(Number(id) ^ 0x222);
    const distractors = ptcpPool
      .filter((f) => f !== lower && Math.abs(f.length - lower.length) <= 4)
      .sort(() => rand() - 0.5)
      .slice(0, 3);

    const options = [...distractors, lower].sort(() => rand() - 0.5);
    return {
      id: `tat-${id}`,
      before: tokens.slice(0, i).join(" "),
      after: tokens.slice(i + 1).join(" "),
      answer: lower,
      options,
      translation,
    };
  }
  return null;
}

function extractSuperlativeExercise(id, text, translation) {
  // Temporal "am nächsten Tag" and ordinal dates are not superlatives.
  if (/\bnext\b/i.test(translation)) return null;
  if (!/\bmost\b|\bleast\b|[a-z]est\b/i.test(translation)) return null;
  if (!baseSentenceChecks(text)) return null;
  const tokens = text.split(/\s+/);
  if (tokens.length < MIN_TOKENS || tokens.length > MAX_TOKENS) return null;

  for (let i = 1; i < tokens.length; i++) {
    const tok = tokens[i].replace(/[.,;:!?„“"()]/g, "").toLowerCase();
    if (tokens[i - 1].replace(/[.,;:!?„“"()]/g, "").toLowerCase() !== "am") continue;
    if (!tok.endsWith("sten") || tok.length < 8) continue;
    const stem = tok.slice(0, -4); // strip "sten"
    if (stem.length < 3 || /[aeiouäöü]$/.test(stem) || ["mei", "zum", "näch"].includes(stem)) continue;

    // Distractors: real comparative/positive forms of the same stem —
    // all ungrammatical after "am". Stems are consonant-closed (checked
    // below), so these derivations produce genuine German words.
    let baseStem = stem;
    if (baseStem.endsWith("ß")) {
      var thirdForm = baseStem.slice(0, -1) + "ss";
    } else {
      var thirdForm = baseStem;
    }
    const candidatePool = [
      baseStem + "er",
      baseStem + "e",
      thirdForm,
    ].filter((w, idx, arr) => w !== tok && arr.indexOf(w) === idx);
    if (candidatePool.length < 3) continue;
    const rand = mulberry32(Number(id) ^ 0x333);
    const distractors = pickDistractors("superlatives", candidatePool, rand);
    if (distractors.length < 3) continue;

    const options = [...distractors, tok].sort(() => rand() - 0.5);
    return {
      id: `tat-${id}`,
      before: tokens.slice(0, i).join(" "),
      after: tokens.slice(i + 1).join(" "),
      answer: tok,
      options,
      translation,
    };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Generation loop
// ---------------------------------------------------------------------------

initDistractorTracking(TOPIC_DEFS.map((t) => t.slug));

const buckets = new Map(TOPIC_DEFS.map((t) => [t.slug, []]));
// Sentence reuse policy: a sentence may feed at most MAX_TOPICS_PER_SENTENCE
// different topics. Strict exclusivity starves late topics (rare patterns
// like "am schnellsten" co-occur with commonly masked words).
const MAX_TOPICS_PER_SENTENCE = 2;
const sentenceTopicUses = new Map();
// Clone families: different sentence ids, identical text ("ins Kino gehen"
// x5). Dedupe per topic by normalized text.
const seenNormalized = new Map(TOPIC_DEFS.map((t) => [t.slug, new Set()]));
const normalizeText = (s) => s.toLowerCase().replace(/[^a-zäöüß]/g, "");

// True when the displayed line "before ___ after" has balanced quotation
// marks. An odd count means a quote was opened but never closed (or vice
// versa) — almost always because the masked word sat inside a quoted phrase.
const quotesBalanced = (s) => (s.match(/["„“"«»]/g) ?? []).length % 2 === 0;
const perWordCounts = new Map(TOPIC_DEFS.map((t) => [t.slug, new Map()]));
const perLemmaCounts = new Map(TOPIC_DEFS.map((t) => [t.slug, new Map()]));

for (const [deId, enId] of pairs) {
  const de = deu.get(deId);
  if (!de.author || de.author === "\\N") continue; // CC BY attribution needs an author
  if ((sentenceTopicUses.get(deId) ?? 0) >= MAX_TOPICS_PER_SENTENCE) continue;

  let allFull = true;
  for (const def of TOPIC_DEFS) {
    const bucket = buckets.get(def.slug);
    if (bucket.length >= def.maxItems) continue;
    allFull = false;

    let exercise = null;
    if (def.kind === "words") exercise = extractWordsExercise(deId, de.text, eng.get(enId).text, def);
    else if (def.kind === "adjending") exercise = extractAdjEndingExercise(deId, de.text, eng.get(enId).text);
    else if (def.kind === "morph") exercise = extractMorphExercise(deId, de.text, eng.get(enId).text, def);
    else if (def.kind === "modal") exercise = extractModalExercise(deId, de.text, eng.get(enId).text);
    else if (def.kind === "ptcp") exercise = extractPtcpExercise(deId, de.text, eng.get(enId).text);
    else if (def.kind === "degree") exercise = extractSuperlativeExercise(deId, de.text, eng.get(enId).text);
     if (!exercise) continue;

    // Reject exercises where masking leaves an unbalanced quote — e.g.
    // `unter "ferner liefen"` loses its open quote when "ferner" is masked,
    // producing the broken fragment `unter ___ liefen".`
    if (!quotesBalanced(exercise.before + " " + exercise.after)) continue;

    if (process.env.DBG && ["demonstratives", "superlatives"].includes(def.slug) && bucket.length < 2)
      console.error(`DBG ${def.slug}:`, JSON.stringify(exercise));

    // Balance guard: don't flood a topic with one answer form or one lemma.
    const wordCounts = perWordCounts.get(def.slug);
    if ((wordCounts.get(exercise.answer) ?? 0) >= (def.maxPerWord ?? Infinity)) continue;
    const lemmaCounts = perLemmaCounts.get(def.slug);
    if (
      exercise.lemma &&
      (lemmaCounts.get(exercise.lemma) ?? 0) >= (def.maxPerLemma ?? Infinity)
    )
      continue;

    exercise.author = de.author;
    const normKey = normalizeText(exercise.before + exercise.answer + exercise.after);
    if (seenNormalized.get(def.slug).has(normKey)) continue;
    seenNormalized.get(def.slug).add(normKey);
    bucket.push(repairComma(exercise));
    noteOptionsShown(def.slug, exercise.options);
    sentenceTopicUses.set(deId, (sentenceTopicUses.get(deId) ?? 0) + 1);
    wordCounts.set(exercise.answer, (wordCounts.get(exercise.answer) ?? 0) + 1);
    if (exercise.lemma)
      lemmaCounts.set(exercise.lemma, (lemmaCounts.get(exercise.lemma) ?? 0) + 1);
  }
  if (allFull) break;
}

for (const def of TOPIC_DEFS) {
  const file = `data/grammar-${def.slug}.json`;
  const items = buckets.get(def.slug);
  writeFileSync(
    file,
    JSON.stringify(
      {
        meta: {
          topic: def.topic,
          description: def.description,
          cefrLevel: def.cefrLevel,
          generatedBy: "scripts/generate-grammar-data.mjs",
          ...LICENSE_META,
        },
        items,
      },
      null,
      2
    )
  );
  console.log(`${file}: ${items.length} items`);
}
