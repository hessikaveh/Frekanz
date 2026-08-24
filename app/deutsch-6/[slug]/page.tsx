import LessonPage from "../../components/LessonPage";
import { getLevelSlugs } from "@/lib/german-data";

export function generateStaticParams() {
  return getLevelSlugs(6);
}

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  return <LessonPage level={6} slug={slug} />;
}
