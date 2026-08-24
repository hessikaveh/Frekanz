"use client";
import Link from "next/link";
import { useMemo } from "react";
import { useStore } from "../store/store";
import {
  getLevelPosts,
  getPostsByLesson,
  lessonNumberToSlug,
  LESSONS_PER_LEVEL,
  Level,
} from "@/lib/german-data";

interface LessonCardProps {
  level: Level;
  lessonNumber: number;
  solvedCount: number;
  words: string[];
}

const WORDS_SHOWN = 6;

function LessonCard({ level, lessonNumber, solvedCount, words }: LessonCardProps) {
  const pct = words.length > 0 ? Math.round((solvedCount / words.length) * 100) : 0;
  const complete = solvedCount === words.length && words.length > 0;

  return (
    <Link
      href={`/deutsch-${level}/${lessonNumberToSlug(lessonNumber)}`}
      className={`card shadow-sm border no-underline transition-colors p-3 gap-2 ${
        complete
          ? "bg-primary text-primary-content border-primary"
          : "bg-base-200 hover:bg-base-300 border-base-300"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-black">{lessonNumber}</span>
        <div
          className="radial-progress"
          style={
            {
              "--value": pct,
              "--size": "2.25rem",
              "--thickness": "0.25rem",
            } as React.CSSProperties
          }
          role="progressbar"
          aria-label={`${solvedCount} of ${words.length} solved`}
        >
          <span className="text-[10px] font-bold">{words.length > 0 ? pct : 0}%</span>
        </div>
      </div>
      <div className="text-xs opacity-75 leading-snug line-clamp-2">
        {words.slice(0, WORDS_SHOWN).join(" · ")}
        {words.length > WORDS_SHOWN ? " …" : ""}
      </div>
    </Link>
  );
}

interface LessonListPageProps {
  level: Level;
}

export default function LessonListPage({ level }: LessonListPageProps) {
  const wordPuzzles = useStore((store) => store.wordPuzzles);

  const postsByLesson = useMemo(
    () => getPostsByLesson(getLevelPosts(level)),
    [level]
  );

  const solvedCountsByLesson = useMemo(() => {
    const counts = new Map<number, number>();
    for (const puzzle of wordPuzzles) {
      if (puzzle.state !== "solved") continue;
      const match = /^lesson-(\d+)$/.exec(puzzle.bundle);
      if (!match) continue;
      const lessonNumber = Number(match[1]);
      counts.set(lessonNumber, (counts.get(lessonNumber) ?? 0) + 1);
    }
    return counts;
  }, [wordPuzzles]);

  const firstLessonNumber = (level - 1) * LESSONS_PER_LEVEL + 1;
  const totalWords = useMemo(
    () => [...postsByLesson.values()].reduce((sum, posts) => sum + posts.length, 0),
    [postsByLesson]
  );
  const solvedTotal = useMemo(
    () => [...solvedCountsByLesson.values()].reduce((sum, n) => sum + n, 0),
    [solvedCountsByLesson]
  );
  const overallPct =
    totalWords > 0 ? Math.round((solvedTotal / totalWords) * 100) : 0;

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-12">
      <article className="prose lg:prose-xl prose-img:mx-auto w-full max-w-5xl">
        <div className="flex flex-col items-center">
          <h1 className="font-black">Chapter {level}</h1>
          <p className="text-sm opacity-70 -mt-3">
            Words {level * 1000 - 999}&ndash;{level * 1000}
          </p>
          <progress
            className="progress progress-primary w-full max-w-xs mt-2"
            value={overallPct}
            max={100}
            aria-label={`${overallPct}% of chapter solved`}
          />
          <p className="text-sm opacity-70 mt-1">
            {solvedTotal}/{totalWords} solved · {overallPct}%
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 not-prose mt-6">
          {Array.from({ length: LESSONS_PER_LEVEL }, (_, i) => {
            const lessonNumber = firstLessonNumber + i;
            const posts = postsByLesson.get(lessonNumberToSlug(lessonNumber));
            return (
              <LessonCard
                key={lessonNumber}
                level={level}
                lessonNumber={lessonNumber}
                solvedCount={solvedCountsByLesson.get(lessonNumber) ?? 0}
                words={posts?.map((post) => post.word) ?? []}
              />
            );
          })}
        </div>
      </article>
    </main>
  );
}
