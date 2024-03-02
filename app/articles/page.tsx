import Link from "next/link";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <article className="prose lg:prose-xl prose-img:mx-auto">
        <Link href="/articles/post02">
          <h1>Top 10</h1>
        </Link>
        <p>Top 10 most frequent words.</p>
        <Link href="/articles/post02"></Link>
      </article>
    </main>
  );
}
