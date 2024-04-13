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
          Willkommen! Dive into the vibrant world of German language mastery
          with our revolutionary platform designed to propel you towards fluency
          at warp speed! Say goodbye to tedious memorization and hello to
          dynamic learning experiences that engage your senses and sharpen your
          skills. Imagine effortlessly navigating the bustling streets of Berlin
          or conversing with confidence in Munich&apos;s famous beer gardens.
          With our innovative drag-and-drop exercises, you&apos;ll seamlessly
          match translations with real-life sentences plucked straight from
          today&apos;s top news websites. Each interaction is a thrilling
          challenge, igniting your curiosity and fueling your progress. But
          that&apos;s not all! Experience the rhythm and cadence of the language
          as you listen to each sentence spoken aloud, fine-tuning your
          pronunciation and honing your ear for authentic German speech. Join
          our community of language enthusiasts and embark on an exhilarating
          journey towards mastering the most frequent 7000 words of the German
          language. Are you ready to unlock the door to a world of opportunity?
          Let&apos;s embark on this adventure together!
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
