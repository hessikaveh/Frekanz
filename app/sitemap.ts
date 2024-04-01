import { MetadataRoute } from "next";

interface SitemapItem {
  url: string;
  lastModified: Date;
  changeFrequency: string;
  priority: number;
}

export default function sitemap(): SitemapItem[] {
  const baseUrl = "https://frekanz.vercel.app/deutsch/lesson-";

  // Generate sitemap entries for lessons 1 to 100
  const lessons: SitemapItem[] = [];
  for (let i = 1; i <= 100; i++) {
    lessons.push({
      url: `${baseUrl}${i}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    });
  }

  // Additional sitemap entries
  const additionalEntries: SitemapItem[] = [
    {
      url: "https://frekanz.vercel.app/",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://frekanz.vercel.app/german",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Concatenate additional entries with lessons
  const sitemap: SitemapItem[] = additionalEntries.concat(lessons);

  return sitemap;
}
