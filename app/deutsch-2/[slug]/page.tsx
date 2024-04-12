import Link from "next/link";
import DraggableComponent from "../../components/CustomComponents/Draggablecomponent";
import { jsonData, Post } from "../../api/german-data-2/data";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts: Post[] = JSON.parse(jsonData);

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  // deduped
  const posts: Post[] = JSON.parse(jsonData);
  const cardContents: Post[] = posts.filter(
    (post) => post.slug === params.slug
  );
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
    <main className="flex min-h-screen flex-col items-center p-1 md:p-24">
      <Link href="/german-2" className="btn btn-sm btn-ghost">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
          <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8z" />
          <path d="M13.293 7.293 8.586 12l4.707 4.707 1.414-1.414L11.414 12l3.293-3.293-1.414-1.414z" />
        </svg>
        Back to lessons overview
      </Link>

      <div className="carousel prose carousel-center  w-full">
        {cardContents.map((wordData, index) => (
          <div
            id={index.toString()}
            key={index}
            className=" carousel-item w-full"
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
        Monolingual Dictionaries at the Leipzig Corpora Collection: From 100 to
        200 Languages. In: Proceedings of the 8th International Language
        Resources and Evaluation (LREC&apos;12), 2012) and is licensed under CC
        BY 4.0{" "}
        <Link href="https://wortschatz.uni-leipzig.de/en/download/">
          more info
        </Link>
      </p>
    </main>
  );
}
