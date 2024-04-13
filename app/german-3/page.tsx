"use client";
import Link from "next/link";
import { useStore } from "../store/store";
import { jsonData, Post } from "../api/german-data-3/data";

interface LessonLink {
  lessonNumber: number;
  solvedCount: number;
}
// LessonLink component representing each lesson link
function LessonLink({ lessonNumber, solvedCount }: LessonLink) {
  const posts: Post[] = JSON.parse(jsonData);
  const cardContents: Post[] = posts.filter(
    (post) => post.slug === `lesson-${lessonNumber}`
  );
  return (
    <div className="flex justify-center items-center flex-col">
      <div className="flex flex-1">
        <p className="pe-6"></p>
        <div className="h-[60px] min-h-[1em] w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400"></div>
        <p className="ps-6"></p>
      </div>
      <Link
        className="flex justify-center items-center no-underline hover:-translate-x-10 transition"
        href={`/deutsch-3/lesson-${lessonNumber}`}
      >
        <div
          className="sm:pl-5 lg:pl-9 tooltip translate-x-16  lg:translate-x-20"
          data-tip={`${solvedCount}/10`}
        >
          <div
            className="radial-progress bg-primary text-primary-content m-3 shadow-md border-4 border-slate-600 font-black"
            style={
              {
                "--value": (solvedCount * 10).toString(),
              } as React.CSSProperties
            }
            role="progressbar"
          >
            {lessonNumber}
          </div>
        </div>
        <div className="mx-2 translate-x-14 lg:translate-x-16 font-extrabold transition-transform">
          Lesson {lessonNumber}
          <div className="mx-1 flex w-3/5 flex-wrap">
            {cardContents.map((post, index) => (
              <span className=" mx-1 font-extrabold text-gray-400" key={index}>
                {post.word}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function Page() {
  // Filter the word puzzles for the specified bundle and count the occurrences of "solved" states
  interface SolvedCounts {
    [key: string]: number;
  }

  const start = 200;
  const solvedCounts: SolvedCounts = Object.fromEntries(
    Array.from({ length: 100 }, (_, i) => [
      `solvedCount0${i + start + 1}`,
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useStore(
        (store) =>
          store.wordPuzzles.filter(
            (puzzle) =>
              puzzle.bundle === `lesson-${i + start + 1}` &&
              puzzle.state === "solved"
          ).length
      ),
    ])
  );

  // Generate lesson links dynamically using LessonLink component
  const lessonLinks = Array.from({ length: 100 }, (_, i) => (
    <LessonLink
      key={i + start + 1}
      lessonNumber={i + start + 1}
      solvedCount={solvedCounts[`solvedCount0${i + start + 1}`]}
    />
  ));

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-1 md:p-24">
      <article className="prose lg:prose-xl prose-img:mx-auto">
        <div className="flex justify-center items-center flex-col">
          <p className="font-extrabold max-w-xs text-center">
            Each lesson contains 10 words starting from the most frequent.
          </p>
          {lessonLinks}
        </div>
      </article>
    </main>
  );
}
