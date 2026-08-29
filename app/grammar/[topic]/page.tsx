import Link from "next/link";
import GrammarQuiz from "../../components/GrammarQuiz";
import {
  getGrammarTopic,
  getGrammarTopics,
  GRAMMAR_ATTRIBUTION,
} from "@/lib/grammar-data";

interface Props {
  params: Promise<{ topic: string }>;
}

export function generateStaticParams() {
  return getGrammarTopics().map((t) => ({ topic: t.slug }));
}

export default async function GrammarTopicPage(props: Props) {
  const { topic: slug } = await props.params;
  const topic = getGrammarTopic(slug);

  if (!topic) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p>Unknown grammar topic.</p>
        <Link href="/grammar" className="btn btn-sm btn-ghost">
          Back to grammar overview
        </Link>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-12">
      <div className="w-full max-w-xl flex items-center justify-between">
        <Link href="/grammar" className="btn btn-sm btn-ghost">
          ❮ All topics
        </Link>
        <span className="badge badge-primary badge-outline">
          {topic.cefrLevel}
        </span>
      </div>
      <h1 className="prose prose-xl font-black my-4">{topic.topic}</h1>
      <GrammarQuiz topic={topic} />
      <footer className="mt-auto pt-8 pb-4 text-center text-xs opacity-60 max-w-xl">
        {GRAMMAR_ATTRIBUTION} — sentence authors are credited with each
        exercise.
      </footer>
    </main>
  );
}
