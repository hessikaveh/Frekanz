"use client";
import DraggableComponent from "../../components/CustomComponents/Draggablecomponent";
import { useState } from "react";
import { jsonData } from "../../data/data02";
import Link from "next/link";

function Page() {
  const draggableItems: any[] = [];
  const containers: any[] = [];
  const [enToDe, setEnToDe] = useState(false);

  jsonData.forEach((entry, index) => {
    const words = entry.translation.split(" ");

    const wordList = words.map((word, wordIndex) => ({
      label: word,
      id_outer: `t${index + 1}-${wordIndex + 1}`,
    }));
    draggableItems.push(wordList);
    containers.push(wordList.map((word) => word.id_outer));
  });

  const reverseOrder = () => {
    setEnToDe(!enToDe); // Update state using setState function
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <article className="max-w-sm md:max-w-2xl xl:max-w-4xl prose flex flex-col">
        <div onClick={reverseOrder}></div>
        <div className="max-w-sm md:max-w-2xl xl:max-w-4xl carousel-center carousel">
          {jsonData.map((wordData, index) => (
            <div
              id={index.toString()}
              key={index}
              className="carousel-item w-full"
            >
              <Link
                href={`#${Math.max(0, index - 1).toString()}`}
                className="btn btn-ghost mx-6 min-h-screen"
              >
                ❮
              </Link>

              <DraggableComponent
                containers={containers[index]}
                draggableItems={draggableItems[index]}
                sentence={wordData.sentence}
                word={wordData.word}
              />

              <Link
                href={`#${(index + 1).toString()}`}
                className="btn btn-ghost mx-6 min-h-screen"
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

export default Page;
