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
          <p className="font-extrabold max-w-xs text-center">
            Each lesson contains 10 words starting from the most frequent.
          </p>
          <Link
            className="flex justify-center items-center no-underline hover:-translate-x-10 transition"
            href="/german/post00"
          >
            <div
              className="tooltip translate-x-9 md:translate-x-10"
              data-tip={solvedCounts.solvedCount01 + "/10"}
            >
              <div
                className="radial-progress bg-primary text-primary-content m-3 shadow-md border-4 border-slate-600 font-black"
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
            <div className=" -z-10 translate-x-9 font-semibold transition-transform">
              Lesson 1
            </div>
          </Link>
        </div>

        <div className="flex justify-center items-center flex-col">
          <div className="flex flex-1">
            <p className="pe-6"></p>
            <div className="h-[60px] min-h-[1em] w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400"></div>
            <p className="ps-6"></p>
          </div>
          <Link
            className="flex justify-center items-center  no-underline hover:translate-x-10 transition"
            href="/german/post01"
          >
            <div className=" -z-10 -translate-x-9 font-semibold transition-transform">
              Lesson 2
            </div>
            <div
              className="tooltip -translate-x-8 md:-translate-x-11"
              data-tip={solvedCounts.solvedCount02 + "/10"}
            >
              <div
                className="radial-progress bg-primary text-primary-content m-3 shadow-md border-4 border-slate-600 font-black"
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
          </Link>
        </div>
        <div className="flex justify-center items-center flex-col">
          <div className="flex flex-1">
            <p className="pe-6"></p>
            <div className="h-[60px] min-h-[1em] w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400"></div>
            <p className="ps-6"></p>
          </div>
          <Link
            className="flex justify-center items-center no-underline hover:-translate-x-10 transition"
            href="/german/post02"
          >
            <div
              className="tooltip translate-x-9 md:translate-x-10"
              data-tip={solvedCounts.solvedCount03 + "/10"}
            >
              <div
                className="radial-progress bg-primary text-primary-content m-3 shadow-md border-4 border-slate-600 font-black"
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
            <div className=" -z-10 translate-x-9 font-semibold transition-transform">
              Lesson 3
            </div>
          </Link>
        </div>

        <div className="flex justify-center items-center flex-col">
          <div className="flex flex-1">
            <p className="pe-6"></p>
            <div className="h-[60px] min-h-[1em] w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400"></div>
            <p className="ps-6"></p>
          </div>
          <Link
            className="flex justify-center items-center  no-underline hover:translate-x-10 transition"
            href="/german/post03"
          >
            <div className=" -z-10 -translate-x-9 font-semibold transition-transform">
              Lesson 4
            </div>
            <div
              className="tooltip -translate-x-8 md:-translate-x-11"
              data-tip={solvedCounts.solvedCount04 + "/10"}
            >
              <div
                className="radial-progress bg-primary text-primary-content m-3 shadow-md border-4 border-slate-600 font-black"
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
          </Link>
        </div>
        <div className="flex justify-center items-center flex-col">
          <div className="flex flex-1">
            <p className="pe-6"></p>
            <div className="h-[60px] min-h-[1em] w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400"></div>
            <p className="ps-6"></p>
          </div>
          <Link
            className="flex justify-center items-center no-underline hover:-translate-x-10 transition"
            href="/german/post04"
          >
            <div
              className="tooltip translate-x-9 md:translate-x-10"
              data-tip={solvedCounts.solvedCount05 + "/10"}
            >
              <div
                className="radial-progress bg-primary text-primary-content m-3 shadow-md border-4 border-slate-600 font-black"
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
            <div className=" -z-10 translate-x-9 font-semibold transition-transform">
              Lesson 5
            </div>
          </Link>
        </div>

        <div className="flex justify-center items-center flex-col">
          <div className="flex flex-1">
            <p className="pe-6"></p>
            <div className="h-[60px] min-h-[1em] w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400"></div>
            <p className="ps-6"></p>
          </div>
          <Link
            className="flex justify-center items-center  no-underline hover:translate-x-10 transition"
            href="/german/post05"
          >
            <div className=" -z-10 -translate-x-9 font-semibold transition-transform">
              Lesson 6
            </div>
            <div
              className="tooltip -translate-x-8 md:-translate-x-11"
              data-tip={solvedCounts.solvedCount06 + "/10"}
            >
              <div
                className="radial-progress bg-primary text-primary-content m-3 shadow-md border-4 border-slate-600 font-black"
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
          </Link>
        </div>
        <div className="flex justify-center items-center flex-col">
          <div className="flex flex-1">
            <p className="pe-6"></p>
            <div className="h-[60px] min-h-[1em] w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400"></div>
            <p className="ps-6"></p>
          </div>
          <Link
            className="flex justify-center items-center no-underline hover:-translate-x-10 transition"
            href="/german/post06"
          >
            <div
              className="tooltip translate-x-9 md:translate-x-10"
              data-tip={solvedCounts.solvedCount07 + "/10"}
            >
              <div
                className="radial-progress bg-primary text-primary-content m-3 shadow-md border-4 border-slate-600 font-black"
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
            <div className=" -z-10 translate-x-9 font-semibold transition-transform">
              Lesson 7
            </div>
          </Link>
        </div>

        <div className="flex justify-center items-center flex-col">
          <div className="flex flex-1">
            <p className="pe-6"></p>
            <div className="h-[60px] min-h-[1em] w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400"></div>
            <p className="ps-6"></p>
          </div>
          <Link
            className="flex justify-center items-center  no-underline hover:translate-x-10 transition"
            href="/german/post07"
          >
            <div className=" -z-10 -translate-x-9 font-semibold transition-transform">
              Lesson 8
            </div>
            <div
              className="tooltip -translate-x-8 md:-translate-x-11"
              data-tip={solvedCounts.solvedCount08 + "/10"}
            >
              <div
                className="radial-progress bg-primary text-primary-content m-3 shadow-md border-4 border-slate-600 font-black"
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
          </Link>
        </div>
        <div className="flex justify-center items-center flex-col">
          <div className="flex flex-1">
            <p className="pe-6"></p>
            <div className="h-[60px] min-h-[1em] w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400"></div>
            <p className="ps-6"></p>
          </div>
          <Link
            className="flex justify-center items-center no-underline hover:-translate-x-10 transition"
            href="/german/post08"
          >
            <div
              className="tooltip translate-x-9 md:translate-x-10"
              data-tip={solvedCounts.solvedCount09 + "/10"}
            >
              <div
                className="radial-progress bg-primary text-primary-content m-3 shadow-md border-4 border-slate-600 font-black"
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
            <div className=" -z-10 translate-x-9 font-semibold transition-transform">
              Lesson 9
            </div>
          </Link>
        </div>

        <div className="flex justify-center items-center flex-col">
          <div className="flex flex-1">
            <p className="pe-6"></p>
            <div className="h-[60px] min-h-[1em] w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400"></div>
            <p className="ps-6"></p>
          </div>
          <Link
            className="flex justify-center items-center  no-underline hover:translate-x-10 transition"
            href="/german/post09"
          >
            <div className=" -z-10 -translate-x-9 font-semibold transition-transform">
              Lesson 10
            </div>
            <div
              className="tooltip -translate-x-10 md:-translate-x-12"
              data-tip={solvedCounts.solvedCount010 + "/10"}
            >
              <div
                className="radial-progress bg-primary text-primary-content m-3 shadow-md border-4 border-slate-600 font-black"
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
          </Link>
        </div>
        <div className="flex justify-center items-center flex-col">
          <div className="flex flex-1">
            <p className="pe-6"></p>
            <div className="h-[60px] min-h-[1em] w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400"></div>
            <p className="ps-6"></p>
          </div>
          <Link
            className="flex justify-center items-center no-underline hover:-translate-x-10 transition"
            href="/german/post10"
          >
            <div
              className="tooltip translate-x-10 md:translate-x-12"
              data-tip={solvedCounts.solvedCount011 + "/10"}
            >
              <div
                className="radial-progress bg-primary text-primary-content m-3 shadow-md border-4 border-slate-600 font-black"
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
            <div className=" -z-10 translate-x-9 font-semibold transition-transform">
              Lesson 11
            </div>
          </Link>
        </div>
      </article>
    </main>
  );
}
