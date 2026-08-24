import ChapterGrid from "../components/ChapterGrid";
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
        <p className="text-4xl font-extrabold text-center">Frekanz</p>
      </article>
      <ChapterGrid />
    </main>
  );
}
