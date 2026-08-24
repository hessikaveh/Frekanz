import LessonPage from "../../components/LessonPage";
import { getLevelSlugs } from "@/lib/german-data";

export function generateStaticParams() {
  return getLevelSlugs(4);
}

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  return <LessonPage level={4} slug={slug} />;
}
