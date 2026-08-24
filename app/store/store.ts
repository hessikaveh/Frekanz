import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

const storage =
  typeof window !== "undefined"
    ? createJSONStorage(() => localStorage)
    : undefined;

type Puzzle = {
  word: string;
  state: string;
  bundle: string;
};
type PuzzleStore = {
  wordPuzzles: Puzzle[];
  addPuzzle: (puzzle: Puzzle) => void;
  updatePuzzleState: (puzzle: Puzzle) => void;
  /** Merge server-side progress into the local store without downgrading it. */
  mergeRemote: (puzzles: Puzzle[]) => void;
};

export const useStore = create<PuzzleStore>()(
  persist(
    (set) => ({
      wordPuzzles: [{ word: "start", state: "unsolved", bundle: "0" }],
      addPuzzle: ({ word, state, bundle }) =>
        set((store) => {
          // Check if the word already exists in the array
          const existingIndex = store.wordPuzzles.findIndex(
            (p) => p.word === word
          );

          if (existingIndex !== -1) {
            // If the word already exists, update its state
            const updatedPuzzles = [...store.wordPuzzles];
            updatedPuzzles[existingIndex].state = state;
            return { wordPuzzles: updatedPuzzles };
          } else {
            // If the word doesn't exist, add it to the array
            return {
              wordPuzzles: [...store.wordPuzzles, { word, state, bundle }],
            };
          }
        }),
      updatePuzzleState: ({ word, state, bundle }) =>
        set((store) => ({
          wordPuzzles: store.wordPuzzles.map((puzzle) =>
            puzzle.word === word ? { ...puzzle, state: state } : puzzle
          ),
        })),
      mergeRemote: (puzzles) =>
        set((store) => {
          const localByWord = new Map(
            store.wordPuzzles.map((p) => [p.word, p])
          );
          for (const { word, state, bundle } of puzzles) {
            const local = localByWord.get(word);
            if (!local) {
              localByWord.set(word, { word, state, bundle });
            } else if (local.state === "unsolved" && state !== "unsolved") {
              // Remote is strictly further along: adopt it.
              localByWord.set(word, { word, state, bundle });
            }
          }
          return { wordPuzzles: [...localByWord.values()] };
        }),
    }),
    { name: "puzzleStore", storage }
  )
);
