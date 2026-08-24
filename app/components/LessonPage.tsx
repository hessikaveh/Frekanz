import Link from "next/link";
import DraggableComponent from "./CustomComponents/Draggablecomponent";
import {
  getLevelPosts,
  getPostsByLesson,
  LEIPZIG_ATTRIBUTION_TEXT,
  LEIPZIG_ATTRIBUTION_URL,
  Level,
} from "@/lib/german-data";

interface LessonPageProps {
  level: Level;
  slug: string;
}

export default function LessonPage({ level, slug }: LessonPageProps) {
  const cardContents = getPostsByLesson(getLevelPosts(level)).get(slug) ?? [];

  const draggableItems = cardContents.map((entry, index) =>
    entry.translation.split(" ").map((word, wordIndex) => ({
      label: word,
      id_outer: `t${index + 1}-${wordIndex + 1}`,
    }))
  );
  const containers = draggableItems.map((wordList) =>
    wordList.map((word) => word.id_outer)
  );

  return (
    <main className="flex min-h-screen flex-col items-center p-1 md:p-24">
      <Link href={`/german-${level}`} className="btn btn-sm btn-ghost">
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
      <p className="text-sm opacity-70">
        {cardContents.length} words · click the arrows or a number to navigate
      </p>
      <div className="flex flex-wrap justify-center gap-1 max-w-xl">
        {cardContents.map((_, index) => (
          <a
            key={index}
            href={`#${index}`}
            className="btn btn-xs btn-circle btn-ghost font-bold"
          >
            {index + 1}
          </a>
        ))}
      </div>
      <p>
        {" "}
        {LEIPZIG_ATTRIBUTION_TEXT}{" "}
        <Link href={LEIPZIG_ATTRIBUTION_URL}>more info</Link>
      </p>
    </main>
  );
}
