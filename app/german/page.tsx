"use client";
import Link from "next/link";
import { useStore } from "../store/store";

export default function Page() {
  // Filter the word puzzles for the specified bundle and count the occurrences of "solved" states
  interface SolvedCounts {
    [key: string]: number;
  }

  const solvedCounts: SolvedCounts = Object.fromEntries(
    Array.from({ length: 11 }, (_, i) => [
      `solvedCount0${i + 1}`,
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useStore(
        (store) =>
          store.wordPuzzles.filter(
            (puzzle) => puzzle.bundle === i + 1 && puzzle.state === "solved"
          ).length
      ),
    ])
  );
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-1 md:p-24">
      <article className="prose lg:prose-xl prose-img:mx-auto">
        <div className="flex justify-center items-center flex-col">
          <Link
            className="flex justify-center items-center flex-col no-underline"
            href="/german/post00"
          >
            <div
              className="tooltip"
              data-tip={solvedCounts.solvedCount01 + "/10"}
            >
              <div
                className="radial-progress bg-primary text-primary-content m-3 shadow-md border-4 border-primary font-black"
                style={
                  {
                    "--value": (
                      solvedCounts.solvedCount01 * 10
                    ).toString() as string,
                  } as React.CSSProperties
                }
                role="progressbar"
              >
                1
              </div>
            </div>
            <p className="text-center">
              Top 10 most frequent words that have larger than 4 characters.
            </p>
          </Link>
        </div>

        <div className="flex justify-center items-center flex-col">
          <Link
            className="flex justify-center items-center flex-col no-underline"
            href="/german/post01"
          >
            <div
              className="tooltip"
              data-tip={solvedCounts.solvedCount02 + "/10"}
            >
              <div
                className="radial-progress bg-primary text-primary-content m-3 shadow-md border-4 border-primary font-black"
                style={
                  {
                    "--value": (
                      solvedCounts.solvedCount02 * 10
                    ).toString() as string,
                  } as React.CSSProperties
                }
                role="progressbar"
              >
                2
              </div>
            </div>
            <p className="text-center">
              The next 10 most frequent words that have larger than 4
              characters.
            </p>
          </Link>
        </div>

        <div className="flex justify-center items-center flex-col">
          <Link
            className="flex justify-center items-center flex-col no-underline"
            href="/german/post02"
          >
            <div
              className="tooltip"
              data-tip={solvedCounts.solvedCount03 + "/10"}
            >
              <div
                className="radial-progress bg-primary text-primary-content m-3 shadow-md border-4 border-primary font-black"
                style={
                  {
                    "--value": (
                      solvedCounts.solvedCount03 * 10
                    ).toString() as string,
                  } as React.CSSProperties
                }
                role="progressbar"
              >
                3
              </div>
            </div>
            <p className="text-center">
              The next 10 most frequent words that have larger than 4
              characters.
            </p>
          </Link>
        </div>

        <div className="flex justify-center items-center flex-col">
          <Link
            className="flex justify-center items-center flex-col no-underline"
            href="/german/post03"
          >
            <div
              className="tooltip"
              data-tip={solvedCounts.solvedCount04 + "/10"}
            >
              <div
                className="radial-progress bg-primary text-primary-content m-3 shadow-md border-4 border-primary font-black"
                style={
                  {
                    "--value": (
                      solvedCounts.solvedCount04 * 10
                    ).toString() as string,
                  } as React.CSSProperties
                }
                role="progressbar"
              >
                4
              </div>
            </div>
            <p className="text-center">
              The next 10 most frequent words that have larger than 4
              characters.
            </p>
          </Link>
        </div>

        <div className="flex justify-center items-center flex-col">
          <Link
            className="flex justify-center items-center flex-col no-underline"
            href="/german/post04"
          >
            <div
              className="tooltip"
              data-tip={solvedCounts.solvedCount05 + "/10"}
            >
              <div
                className="radial-progress bg-primary text-primary-content m-3 shadow-md border-4 border-primary font-black"
                style={
                  {
                    "--value": (
                      solvedCounts.solvedCount05 * 10
                    ).toString() as string,
                  } as React.CSSProperties
                }
                role="progressbar"
              >
                5
              </div>
            </div>
            <p className="text-center">
              The next 10 most frequent words that have larger than 4
              characters.
            </p>
          </Link>
        </div>

        <div className="flex justify-center items-center flex-col">
          <Link
            className="flex justify-center items-center flex-col no-underline"
            href="/german/post05"
          >
            <div
              className="tooltip"
              data-tip={solvedCounts.solvedCount06 + "/10"}
            >
              <div
                className="radial-progress bg-primary text-primary-content m-3 shadow-md border-4 border-primary font-black"
                style={
                  {
                    "--value": (
                      solvedCounts.solvedCount06 * 10
                    ).toString() as string,
                  } as React.CSSProperties
                }
                role="progressbar"
              >
                6
              </div>
            </div>
            <p className="text-center">
              The next 10 most frequent words that have larger than 4
              characters.
            </p>
          </Link>
        </div>

        <div className="flex justify-center items-center flex-col">
          <Link
            className="flex justify-center items-center flex-col no-underline"
            href="/german/post06"
          >
            <div
              className="tooltip"
              data-tip={solvedCounts.solvedCount07 + "/10"}
            >
              <div
                className="radial-progress bg-primary text-primary-content m-3 shadow-md border-4 border-primary font-black"
                style={
                  {
                    "--value": (
                      solvedCounts.solvedCount07 * 10
                    ).toString() as string,
                  } as React.CSSProperties
                }
                role="progressbar"
              >
                7
              </div>
            </div>
            <p className="text-center">
              The next 10 most frequent words that have larger than 4
              characters.
            </p>
          </Link>
        </div>

        <div className="flex justify-center items-center flex-col">
          <Link
            className="flex justify-center items-center flex-col no-underline"
            href="/german/post07"
          >
            <div
              className="tooltip"
              data-tip={solvedCounts.solvedCount08 + "/10"}
            >
              <div
                className="radial-progress bg-primary text-primary-content m-3 shadow-md border-4 border-primary font-black"
                style={
                  {
                    "--value": (
                      solvedCounts.solvedCount08 * 10
                    ).toString() as string,
                  } as React.CSSProperties
                }
                role="progressbar"
              >
                8
              </div>
            </div>
            <p className="text-center">
              The next 10 most frequent words that have larger than 4
              characters.
            </p>
          </Link>
        </div>

        <div className="flex justify-center items-center flex-col">
          <Link
            className="flex justify-center items-center flex-col no-underline"
            href="/german/post08"
          >
            <div
              className="tooltip"
              data-tip={solvedCounts.solvedCount09 + "/10"}
            >
              <div
                className="radial-progress bg-primary text-primary-content m-3 shadow-md border-4 border-primary font-black"
                style={
                  {
                    "--value": (
                      solvedCounts.solvedCount09 * 10
                    ).toString() as string,
                  } as React.CSSProperties
                }
                role="progressbar"
              >
                9
              </div>
            </div>
            <p className="text-center">
              The next 10 most frequent words that have larger than 4
              characters.
            </p>
          </Link>
        </div>

        <div className="flex justify-center items-center flex-col">
          <Link
            className="flex justify-center items-center flex-col no-underline"
            href="/german/post09"
          >
            <div
              className="tooltip"
              data-tip={solvedCounts.solvedCount010 + "/10"}
            >
              <div
                className="radial-progress bg-primary text-primary-content m-3 shadow-md border-4 border-primary font-black"
                style={
                  {
                    "--value": (
                      solvedCounts.solvedCount010 * 10
                    ).toString() as string,
                  } as React.CSSProperties
                }
                role="progressbar"
              >
                10
              </div>
            </div>
            <p className="text-center">
              The next 10 most frequent words that have larger than 4
              characters.
            </p>
          </Link>
        </div>

        <div className="flex justify-center items-center flex-col">
          <Link
            className="flex justify-center items-center flex-col no-underline"
            href="/german/post10"
          >
            <div
              className="tooltip"
              data-tip={solvedCounts.solvedCount011 + "/10"}
            >
              <div
                className="radial-progress bg-primary text-primary-content m-3 shadow-md border-4 border-primary font-black"
                style={
                  {
                    "--value": (
                      solvedCounts.solvedCount011 * 10
                    ).toString() as string,
                  } as React.CSSProperties
                }
                role="progressbar"
              >
                11
              </div>
            </div>
            <p className="text-center">
              The next 10 most frequent words that have larger than 4
              characters.
            </p>
          </Link>
        </div>
      </article>
    </main>
  );
}
