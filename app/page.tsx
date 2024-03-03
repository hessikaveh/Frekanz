import Link from "next/link";
import Script from "next/script";

export default function Home() {
  return (
    <main className="flex min-h-fit flex-col items-center justify-between p-24">
      <div className="container">
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-EV51J1SKL9" />
        <Script id="google-analytics">
          {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-EV51J1SKL9');
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
        <p className="text-center">
          {" "}
          This is a tool to practice the most comon words in german language
          where one can match the translation of a sentence found in the public
          domain by dragging and ropping words in the right order (the box will
          become green if one does it right :D).
        </p>
      </article>
      <div></div>
    </main>
  );
}
