"use client";
import { useEffect, useRef, useState } from "react";
import type { GrammarItem, GrammarTopic } from "@/lib/grammar-data";

type Phase = "idle" | "playing" | "finished";

const ROUND_LENGTHS = [10, 25] as const;

// Seen-exercise tracking lives in localStorage: rounds never repeat
// sentences until the whole pool has been exhausted. No database needed.
function seenStorageKey(slug: string) {
  return `grammar-seen-${slug}`;
}

function loadSeenIds(slug: string): Set<string> {
  try {
    const raw = window.localStorage.getItem(seenStorageKey(slug));
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function saveSeenIds(slug: string, seen: Set<string>) {
  try {
    window.localStorage.setItem(seenStorageKey(slug), JSON.stringify([...seen]));
  } catch {
    // Private mode / storage full: silently degrade to session-only memory.
  }
}

// Load the seen-set, dropping IDs that no longer exist in the current pool
// (e.g. after a data regeneration shrank the topic). Stale IDs would otherwise
// inflate the "seen" count and wrongly trigger the repeat-the-whole-pool path.
function loadSeenForTopic(slug: string, items: GrammarItem[]): Set<string> {
  const valid = new Set(items.map((i) => i.id));
  return new Set([...loadSeenIds(slug)].filter((id) => valid.has(id)));
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

/** Unseen exercises first, then recycled ones once the pool runs out.
 *  Greedy answer-diversity guard: avoids dealing many questions with the
 *  same correct option in one round (e.g., five "nicht" in a row). */
function buildRound(items: GrammarItem[], seen: Set<string>, length: number): GrammarItem[] {
  const unseen = shuffle(items.filter((i) => !seen.has(i.id)));
  const recycled = shuffle(items.filter((i) => seen.has(i.id)));
  const pool = [...unseen, ...recycled];

  const picked: GrammarItem[] = [];
  const pickedIds = new Set<string>();
  const answerCounts = new Map<string, number>();
  // A single answer may fill at most ~1/6 of the round before deferring
  // further same-answer items to the end-fill pass.
  const maxPerAnswer = Math.max(1, Math.ceil(length / 6));

  for (const item of pool) {
    if (picked.length >= length) break;
    if ((answerCounts.get(item.answer) ?? 0) >= maxPerAnswer) continue;
    picked.push(item);
    pickedIds.add(item.id);
    answerCounts.set(item.answer, (answerCounts.get(item.answer) ?? 0) + 1);
  }
  // Underfilled (small pools / heavy skew): top up ignoring the constraint.
  for (const item of pool) {
    if (picked.length >= length) break;
    if (!pickedIds.has(item.id)) {
      picked.push(item);
      pickedIds.add(item.id);
    }
  }
  return picked;
}

export default function GrammarQuiz({ topic }: { topic: GrammarTopic }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [round, setRound] = useState<GrammarItem[]>([]);
  const [newCount, setNewCount] = useState<number | null>(null);

  // Read the seen-set after mount (localStorage is client-only).
  useEffect(() => {
    setNewCount(
      Math.max(0, topic.items.length - loadSeenForTopic(topic.slug, topic.items).size)
    );
  }, [topic.slug]);

  const seenRef = useRef<Set<string>>(new Set());

  function startRound(length: number) {
    const effectiveLength = Math.min(length, topic.items.length);
    seenRef.current = loadSeenForTopic(topic.slug, topic.items);
    saveSeenIds(topic.slug, seenRef.current); // prune stale IDs from storage
    setRound(buildRound(topic.items, seenRef.current, effectiveLength));
    setIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setPhase("playing");
  }

  const item = round[index];
  const answered = selected !== null;
  const isCorrect = selected === item?.answer;

  function select(option: string) {
    if (answered || !item) return;
    setSelected(option);
    if (option === item.answer) setCorrectCount((c) => c + 1);
    // Persist as seen the moment it has been answered.
    seenRef.current.add(item.id);
    saveSeenIds(topic.slug, seenRef.current);
  }

  function next() {
    if (index + 1 >= round.length) {
      setPhase("finished");
      setNewCount(
        Math.max(0, topic.items.length - loadSeenForTopic(topic.slug, topic.items).size)
      );
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  }

  if (phase === "idle") {
    return (
      <div className="card bg-base-200 shadow-md max-w-xl w-full">
        <div className="card-body items-center text-center gap-4">
          <h2 className="card-title font-black">Start a round</h2>
          <p className="text-sm opacity-70">
            {topic.items.length} exercises available
            {newCount !== null && (
              <>
                {" · "}
                <span className="text-success font-bold">{newCount} new</span>
              </>
            )}
            . Sentences you have already solved are only repeated once you have
            worked through the whole pool.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {ROUND_LENGTHS.map((length) => (
              <button
                key={length}
                className="btn btn-outline btn-accent"
                onClick={() => startRound(length)}
              >
                {length} questions
              </button>
            ))}
            <button
              className="btn btn-accent"
              onClick={() => startRound(topic.items.length)}
            >
              All {topic.items.length}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "finished") {
    return (
      <div className="card bg-base-200 shadow-md max-w-xl w-full">
        <div className="card-body items-center text-center">
          <h2 className="card-title font-black text-2xl">
            {correctCount}/{round.length} correct
          </h2>
          <progress
            className="progress progress-primary w-full"
            value={correctCount}
            max={round.length}
          />
          <p className="text-sm opacity-70 mt-2">
            {newCount ?? 0} unseen exercises left in this topic.
          </p>
          <div className="flex gap-3 mt-4">
            <button className="btn btn-accent" onClick={() => startRound(round.length)}>
              Continue
            </button>
            <button className="btn btn-ghost" onClick={() => setPhase("idle")}>
              Overview
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xl">
      <progress
        className="progress progress-primary w-full"
        value={index + (answered ? 1 : 0)}
        max={round.length}
        aria-label="Round progress"
      />
      <p className="text-sm opacity-70 self-end">
        {index + 1} / {round.length}
      </p>

      <div
        className={`card w-full shadow-md border transition-colors ${
          answered
            ? isCorrect
              ? "border-success bg-success/10"
              : "border-error bg-error/10"
            : "bg-base-200 border-base-300"
        }`}
      >
        <div className="card-body">
          <p className="text-xl leading-relaxed">
            {item.before}{" "}
            <span
              className={`inline-block min-w-[4rem] px-2 border-b-4 font-black ${
                answered
                  ? isCorrect
                    ? "border-success text-success"
                    : "border-error text-error"
                  : "border-primary text-primary"
              }`}
            >
              {answered ? selected : "?"}
            </span>
            {/* no extra space when a repaired comma follows the blank */}
            {item.after.startsWith(",") ? item.after : ` ${item.after}`}
          </p>
          {answered && !isCorrect && (
            <p className="text-success font-bold">
              Correct answer: “{item.answer}”
            </p>
          )}
          <p className="text-sm opacity-60">{item.translation}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full">
        {item.options.map((option) => {
          if (!answered) {
            return (
              <button
                key={option}
                onClick={() => select(option)}
                className="btn btn-outline btn-lg normal-case"
              >
                {option}
              </button>
            );
          }
          const isAnswer = option === item.answer;
          const isSelected = option === selected;
          return (
            <button
              key={option}
              disabled
              className={`btn btn-lg normal-case ${
                isAnswer
                  ? "btn-success"
                  : isSelected
                    ? "btn-error"
                    : "btn-disabled"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {answered && (
        <button className="btn btn-accent w-full" onClick={next}>
          {index + 1 >= round.length ? "See results" : "Next"}
        </button>
      )}
    </div>
  );
}
