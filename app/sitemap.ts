import { MetadataRoute } from "next";

interface SitemapItem {
  url: string;
  lastModified: Date;
  changeFrequency: string;
  priority: number;
}

export default function sitemap(): SitemapItem[] {
  const baseUrl = "https://frekanz.vercel.app/deutsch-1/lesson-";

  // Generate sitemap entries for lessons 1 to 100
  const lessons: SitemapItem[] = [];
  for (let i = 1; i <= 100; i++) {
    lessons.push({
      url: `${baseUrl}${i}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    });
  }
  const baseUrl_2 = "https://frekanz.vercel.app/deutsch-2/lesson-";

  // Generate sitemap entries for lessons 1 to 100
  const lessons_2: SitemapItem[] = [];
  for (let i = 100; i <= 200; i++) {
    lessons.push({
      url: `${baseUrl_2}${i}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    });
  }

  const baseUrl_3 = "https://frekanz.vercel.app/deutsch-3/lesson-";

  // Generate sitemap entries for lessons 1 to 100
  const lessons_3: SitemapItem[] = [];
  for (let i = 200; i <= 300; i++) {
    lessons.push({
      url: `${baseUrl_3}${i}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    });
  }
  const baseUrl_4 = "https://frekanz.vercel.app/deutsch-4/lesson-";

  // Generate sitemap entries for lessons 1 to 100
  const lessons_4: SitemapItem[] = [];
  for (let i = 300; i <= 400; i++) {
    lessons.push({
      url: `${baseUrl_4}${i}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    });
  }
  const baseUrl_5 = "https://frekanz.vercel.app/deutsch-5/lesson-";

  // Generate sitemap entries for lessons 1 to 100
  const lessons_5: SitemapItem[] = [];
  for (let i = 400; i <= 500; i++) {
    lessons.push({
      url: `${baseUrl_5}${i}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    });
  }
  const baseUrl_6 = "https://frekanz.vercel.app/deutsch-6/lesson-";

  // Generate sitemap entries for lessons 1 to 100
  const lessons_6: SitemapItem[] = [];
  for (let i = 500; i <= 600; i++) {
    lessons.push({
      url: `${baseUrl_6}${i}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    });
  }
  const baseUrl_7 = "https://frekanz.vercel.app/deutsch-7/lesson-";

  // Generate sitemap entries for lessons 1 to 100
  const lessons_7: SitemapItem[] = [];
  for (let i = 600; i <= 700; i++) {
    lessons.push({
      url: `${baseUrl_7}${i}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
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
  const sitemap: SitemapItem[] = additionalEntries.concat(
    lessons,
    lessons_2,
    lessons_3,
    lessons_4,
    lessons_5,
    lessons_6,
    lessons_7
  );

  return sitemap;
}
