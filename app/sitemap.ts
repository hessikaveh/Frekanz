import { MetadataRoute } from "next";
import { LESSONS_PER_LEVEL, LEVELS } from "../lib/german-data";

interface SitemapItem {
  url: string;
  lastModified: Date;
  changeFrequency: string;
  priority: number;
}

const baseUrl = "https://frekanz.vercel.app";

export default function sitemap(): SitemapItem[] {
  const entries: SitemapItem[] = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${baseUrl}/german`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  for (const level of LEVELS) {
    const firstLessonNumber = (level - 1) * LESSONS_PER_LEVEL + 1;
    for (let i = 0; i < LESSONS_PER_LEVEL; i++) {
      entries.push({
        url: `${baseUrl}/deutsch-${level}/lesson-${firstLessonNumber + i}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 1,
      });
    }
  }

  return entries;
}
