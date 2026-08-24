"use client";
import Link from "next/link";
import { useMemo } from "react";
import { useStore } from "../store/store";
import {
  getLevelPosts,
  LESSONS_PER_LEVEL,
  LEVELS,
  Level,
} from "@/lib/german-data";

function ChapterCard({ level }: { level: Level }) {
  const wordPuzzles = useStore((store) => store.wordPuzzles);

  const total = useMemo(() => getLevelPosts(level).length, [level]);

  const solved = useMemo(() => {
    const minLesson = (level - 1) * LESSONS_PER_LEVEL + 1;
    const maxLesson = level * LESSONS_PER_LEVEL;
    return wordPuzzles.filter((p) => {
      if (p.state !== "solved") return false;
      const match = /^lesson-(\d+)$/.exec(p.bundle);
      const lesson = match ? Number(match[1]) : NaN;
      return lesson >= minLesson && lesson <= maxLesson;
    }).length;
  }, [wordPuzzles, level]);

  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;

  return (
    <Link
      href={`/german-${level}`}
      className="card bg-base-200 hover:bg-base-300 transition-colors shadow-md border border-base-300 no-underline"
    >
      <div className="card-body flex-row items-center gap-4 p-5">
        <div
          className="radial-progress bg-primary text-primary-content font-black shrink-0"
          style={
            { "--value": pct, "--size": "4rem", "--thickness": "0.35rem" } as React.CSSProperties
          }
          role="progressbar"
          aria-label={`${pct}% solved`}
        >
          <span className="text-lg">{level}</span>
        </div>
        <div className="min-w-0">
          <h2 className="card-title font-black">Chapter {level}</h2>
          <p className="text-sm opacity-70">
            {level * 1000 - 999}&ndash;{level * 1000} · {solved}/{total} solved
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function ChapterGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-5xl">
      {LEVELS.map((level) => (
        <ChapterCard key={level} level={level} />
      ))}
    </div>
  );
}
