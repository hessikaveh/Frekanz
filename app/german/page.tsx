import Link from "next/link";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-1 md:p-24">
      <article className="prose lg:prose-xl prose-img:mx-auto">
        <div className="flex justify-center items-center flex-col">
          <p className="font-extrabold max-w-xs text-center">
            Each Chapter contains 1000 words split in 100 lessons. Please click
            on the chapter name to go to lessons.
          </p>
          <div className="steps steps-vertical">
            <Link
              className="step step-accent text-lg font-black"
              href="/german-1/"
            >
              Chapter 1
            </Link>
            <Link
              className="step step-accent text-lg font-black"
              href="/german-2/"
            >
              Chapter 2
            </Link>
            <Link
              className="step step-accent text-lg font-black"
              href="/german-3/"
            >
              Chapter 3
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
