import level1 from "../data/german-level-1.json";
import level2 from "../data/german-level-2.json";
import level3 from "../data/german-level-3.json";
import level4 from "../data/german-level-4.json";
import level5 from "../data/german-level-5.json";
import level6 from "../data/german-level-6.json";
import level7 from "../data/german-level-7.json";

export interface Post {
  word: string;
  sentence: string;
  translation: string;
  freq: number;
  slug: string;
}

export const LEVELS = [1, 2, 3, 4, 5, 6, 7] as const;

export type Level = (typeof LEVELS)[number];

export const LESSONS_PER_LEVEL = 100;
export const WORDS_PER_LESSON = 10;

const LEVEL_DATA: Record<Level, Post[]> = {
  1: level1 as Post[],
  2: level2 as Post[],
  3: level3 as Post[],
  4: level4 as Post[],
  5: level5 as Post[],
  6: level6 as Post[],
  7: level7 as Post[],
};

export function getLevelPosts(level: Level): Post[] {
  return LEVEL_DATA[level];
}

/** Posts grouped by slug ("lesson-1", "lesson-2", ...), preserving order. */
export function getPostsByLesson(posts: Post[]): Map<string, Post[]> {
  const byLesson = new Map<string, Post[]>();
  for (const post of posts) {
    const group = byLesson.get(post.slug);
    if (group) {
      group.push(post);
    } else {
      byLesson.set(post.slug, [post]);
    }
  }
  return byLesson;
}

export function getLevelSlugs(
  level: Level
): { slug: string }[] {
  return getLevelPosts(level).map((post) => ({ slug: post.slug }));
}

export function lessonNumberToSlug(lessonNumber: number): string {
  return `lesson-${lessonNumber}`;
}

export const LEIPZIG_ATTRIBUTION_TEXT =
  "Some of the data is from the corpora provided by Leipzig Corpora Collection " +
  "(D. Goldhahn, T. Eckart & U. Quasthoff: Building Large Monolingual Dictionaries " +
  "at the Leipzig Corpora Collection: From 100 to 200 Languages. In: Proceedings of " +
  "the 8th International Language Resources and Evaluation (LREC'12), 2012) and is " +
  "licensed under CC BY 4.0";

export const LEIPZIG_ATTRIBUTION_URL =
  "https://wortschatz.uni-leipzig.de/en/download/";
