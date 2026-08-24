"use client";
import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useStore } from "@/app/store/store";

const SEED_WORD = "start";
const PUSH_DEBOUNCE_MS = 3000;

function exportablePuzzles() {
  return useStore
    .getState()
    .wordPuzzles.filter((p) => p.word !== SEED_WORD);
}

/**
 * Keeps puzzle progress in sync with the database for signed-in users.
 * - Pulls server progress on login and merges it in (never downgrades local).
 * - Pushes local changes to the server, debounced.
 * Anonymous users keep plain localStorage persistence as before.
 */
export default function ProgressSync() {
  const { status } = useSession();
  const authenticated = status === "authenticated";
  // Guards against echo loops: pushes triggered by a merge are skipped.
  const mergingRef = useRef(false);

  useEffect(() => {
    if (!authenticated) return;

    let cancelled = false;
    fetch("/api/progress")
      .then((res) => (res.ok ? res.json() : null))
      .then((remote) => {
        if (cancelled || !Array.isArray(remote) || remote.length === 0) return;
        mergingRef.current = true;
        useStore.getState().mergeRemote(remote);
        mergingRef.current = false;
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [authenticated]);

  useEffect(() => {
    if (!authenticated) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const unsubscribe = useStore.subscribe((state, prevState) => {
      if (state.wordPuzzles === prevState.wordPuzzles) return;
      if (mergingRef.current) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ puzzles: exportablePuzzles() }),
        }).catch(() => {});
      }, PUSH_DEBOUNCE_MS);
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [authenticated]);

  return null;
}
