import Link from "next/link";
import Script from "next/script";

export default function Home() {
  return (
    <main className="flex min-h-fit flex-col items-center justify-between p-24">
      <meta
        name="google-site-verification"
        content="plPSzxT-ejZi4FaGoi0DdcG9IBCLbA8bQbAaT0RQLuo"
      />
      <div className="container">
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-FHXEJ5QB0B" />
        <Script id="google-analytics">
          {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-FHXEJ5QB0B');
      `}
        </Script>
      </div>
      <article className="prose lg:prose-xl">
        <Link
          style={{ textDecoration: "none" }}
          href="/german/"
          className="text-4xl font-extrabold "
        >
          <p className="text-center">Frekanz</p>
        </Link>
        <p className="prose text-center font-semibold font-sans">
          Learn the 7000 most frequent German words with drag-and-drop
          puzzles built from real news sentences — spoken aloud.
        </p>
      </article>
      <div className="items-center m-4">
        <Link href="/german/" className="btn btn-accent">
          Start Practicing
        </Link>
      </div>
    </main>
  );
}
