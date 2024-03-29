import Link from "next/link";
import DraggableComponent from "../../components/CustomComponents/Draggablecomponent";

interface Post {
  word: string;
  sentence: string;
  translation: string;
  freq: number;
  slug: string;
}

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts: Post[] = await fetch(
    "http://$NEXT_PUBLIC_URL/api/german-data"
  ).then((res) => res.json());

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  // deduped
  const posts: Post[] = await fetch(
    "http://$NEXT_PUBLIC_URL/api/german-data"
  ).then((res) => res.json());
  const cardContents: Post[] = posts.filter(
    (post) => post.slug === params.slug
  )!;
  const draggableItems: any[] = [];
  const containers: any[] = [];
  cardContents.forEach((entry, index) => {
    const words = entry.translation.split(" ");

    const wordList = words.map((word, wordIndex) => ({
      label: word,
      id_outer: `t${index + 1}-${wordIndex + 1}`,
    }));
    draggableItems.push(wordList);
    containers.push(wordList.map((word) => word.id_outer));
  });
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-1 md:p-24">
      <article className="max-w-sm md:max-w-2xl xl:max-w-4xl prose flex flex-col">
        <div className="max-w-sm md:max-w-2xl xl:max-w-4xl carousel-center carousel">
          {cardContents.map((wordData, index) => (
            <div
              id={index.toString()}
              key={index}
              className="carousel-item w-full"
            >
              <Link
                href={`#${Math.max(0, index - 1).toString()}`}
                className="btn btn-ghost mx-1 md:mx-6 min-h-screen"
              >
                ❮
              </Link>

              <DraggableComponent
                containers={containers[index]}
                draggableItems={draggableItems[index]}
                sentence={wordData.sentence}
                word={wordData.word}
                bundle={wordData.slug}
              />

              <Link
                href={`#${(index + 1).toString()}`}
                className="btn btn-ghost mx-1 md:mx-6 min-h-screen"
              >
                ❯
              </Link>
            </div>
          ))}
        </div>
        <p>
          {" "}
          Some of the data is from the corpora provided by Leipzig Corpora
          Collection (D. Goldhahn, T. Eckart & U. Quasthoff: Building Large
          Monolingual Dictionaries at the Leipzig Corpora Collection: From 100
          to 200 Languages. In: Proceedings of the 8th International Language
          Resources and Evaluation (LREC&apos;12), 2012) and is licensed under
          CC BY 4.0{" "}
          <Link href="https://wortschatz.uni-leipzig.de/en/download/">
            more info
          </Link>
        </p>
      </article>
    </main>
  );
}
