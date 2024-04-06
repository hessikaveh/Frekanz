"use client"; // Error components must be Client components

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {}, [error]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="prose font-semibold m-8">Something went wrong!</h1>
      <button className="btn m-4" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
