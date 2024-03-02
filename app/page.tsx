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
          href="/articles/"
          className="text-4xl font-extrabold "
        >
          Frekanz
        </Link>
      </article>
      <div></div>
    </main>
  );
}
