import Link from "next/link";
import { getGrammarTopics, GRAMMAR_ATTRIBUTION } from "@/lib/grammar-data";

const LEVELS = ["A1", "A2", "B1", "B2", "C1"] as const;

export default function GrammarHome() {
  const topics = getGrammarTopics();

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-12">
      <article className="prose lg:prose-xl w-full max-w-5xl">
        <h1 className="font-black text-center">Grammar</h1>
        <p className="text-center opacity-70">
          Fill in the blank — pick the right form
        </p>
        {LEVELS.map((level) => {
          const levelTopics = topics.filter((t) => t.cefrLevel === level);
          if (levelTopics.length === 0) return null;
          return (
            <section key={level} className="not-prose mt-8">
              <h2 className="font-black text-lg mb-3 flex items-center gap-2">
                <span className="badge badge-primary font-bold">{level}</span>
                <span className="opacity-50 text-sm">
                  {levelTopics.length} topics ·{" "}
                  {levelTopics.reduce((sum, t) => sum + t.itemCount, 0)} exercises
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {levelTopics.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/grammar/${t.slug}`}
                    className="card bg-base-200 hover:bg-base-300 transition-colors shadow-md border border-base-300 no-underline"
                  >
                    <div className="card-body p-5">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="card-title font-black text-base">{t.topic}</h3>
                        <span className="text-xs opacity-50 shrink-0">
                          {t.itemCount}
                        </span>
                      </div>
                      <p className="text-sm opacity-70">{t.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </article>
      <footer className="mt-auto pt-8 pb-4 text-center text-xs opacity-60 max-w-xl">
        <a
          href="https://tatoeba.org"
          target="_blank"
          rel="noopener noreferrer"
          className="link link-hover"
        >
          {GRAMMAR_ATTRIBUTION}
        </a>
      </footer>
    </main>
  );
}
