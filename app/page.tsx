import Link from "next/link";
import Script from "next/script";

export default function Home() {
  return (
    <main className="flex min-h-fit flex-col items-center justify-between p-24">
      <meta
        name="google-site-verification"
        content="plPSzxT-ejZi4FaGoi0DdcG9IBCLbA8bQbAaT0RQLuo"
      />
      <article className="prose lg:prose-xl">
        <Link
          style={{ textDecoration: "none" }}
          href="/german/"
          className="text-4xl font-extrabold "
        >
          <p className="text-center">Frekanz</p>
        </Link>
        <p className="text-center">
          {" "}
          This is a tool to practice the most comon words in german language
          where one can match the translation of a sentence found in the public
          domain by dragging and dropping words in the right order (the box will
          become green if one does it right :D).
        </p>
      </article>
      <div></div>
    </main>
  );
}
