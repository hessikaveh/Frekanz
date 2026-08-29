import definiteArticles from "../data/grammar-definite-articles.json";
import indefiniteArticles from "../data/grammar-indefinite-articles.json";
import personalPronouns from "../data/grammar-personal-pronouns.json";
import questionWords from "../data/grammar-question-words.json";
import possessives from "../data/grammar-possessives.json";
import negation from "../data/grammar-negation.json";
import pronounCases from "../data/grammar-pronoun-cases.json";
import prepositions from "../data/grammar-prepositions.json";
import konnektoren from "../data/grammar-konnektoren.json";
import passiveAuxiliaries from "../data/grammar-passive-auxiliaries.json";
import advancedConnectors from "../data/grammar-advanced-connectors.json";
import presentConjugation from "../data/grammar-present-conjugation.json";
import pastTense from "../data/grammar-past-tense.json";
import konjunktivIi from "../data/grammar-konjunktiv-ii.json";
import adjectiveEndings from "../data/grammar-adjective-endings.json";
import perfectAuxiliaries from "../data/grammar-perfect-auxiliaries.json";
import modalVerbs from "../data/grammar-modal-verbs.json";
import participles from "../data/grammar-participles.json";
import contractions from "../data/grammar-contractions.json";
import demonstratives from "../data/grammar-demonstratives.json";
import superlatives from "../data/grammar-superlatives.json";
import correlativePairs from "../data/grammar-correlative-pairs.json";

export interface GrammarItem {
  id: string;
  before: string;
  after: string;
  answer: string;
  options: string[];
  translation: string;
  /** Tatoeba username of the sentence author (CC BY attribution). */
  author: string;
}

interface RawTopic {
  meta: {
    topic: string;
    description: string;
    cefrLevel: string;
    license: string;
    sourceUrl: string;
  };
  items: GrammarItem[];
}

const RAW_TOPICS: (RawTopic & { slug: string })[] = [
  { slug: "definite-articles", ...definiteArticles },
  { slug: "indefinite-articles", ...indefiniteArticles },
  { slug: "personal-pronouns", ...personalPronouns },
  { slug: "question-words", ...questionWords },
  { slug: "possessives", ...possessives },
  { slug: "negation", ...negation },
  { slug: "pronoun-cases", ...pronounCases },
  { slug: "prepositions", ...prepositions },
  { slug: "konnektoren", ...konnektoren },
  { slug: "passive-auxiliaries", ...passiveAuxiliaries },
  { slug: "advanced-connectors", ...advancedConnectors },
  { slug: "present-conjugation", ...presentConjugation },
  { slug: "past-tense", ...pastTense },
  { slug: "konjunktiv-ii", ...konjunktivIi },
  { slug: "adjective-endings", ...adjectiveEndings },
  { slug: "perfect-auxiliaries", ...perfectAuxiliaries },
  { slug: "modal-verbs", ...modalVerbs },
  { slug: "participles", ...participles },
  { slug: "contractions", ...contractions },
  { slug: "demonstratives", ...demonstratives },
  { slug: "superlatives", ...superlatives },
  { slug: "correlative-pairs", ...correlativePairs },
];

export interface GrammarTopicMeta {
  slug: string;
  topic: string;
  description: string;
  cefrLevel: string;
  itemCount: number;
}

export interface GrammarTopic extends GrammarTopicMeta {
  items: GrammarItem[];
  license: string;
  sourceUrl: string;
}

/** Topic list without the (heavy) item payloads — for overview pages. */
export function getGrammarTopics(): GrammarTopicMeta[] {
  return RAW_TOPICS.map(({ meta, items, slug }) => ({
    slug,
    topic: meta.topic,
    description: meta.description,
    cefrLevel: meta.cefrLevel,
    itemCount: items.length,
  }));
}

/** Full topic including all exercises — for quiz pages. */
export function getGrammarTopic(slug: string): GrammarTopic | undefined {
  const raw = RAW_TOPICS.find((t) => t.slug === slug);
  if (!raw) return undefined;
  return {
    slug: raw.slug,
    ...raw.meta,
    itemCount: raw.items.length,
    items: raw.items,
  };
}

export const GRAMMAR_ATTRIBUTION =
  "Grammar exercises generated from sentences by the Tatoeba community, licensed under CC BY 2.0 FR; verb forms computed with UniMorph (CC BY-SA 3.0)";
