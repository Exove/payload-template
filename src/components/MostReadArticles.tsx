import Card from "@/components/Card";
import Heading from "@/components/Heading";
import { Article, Media } from "@/payload-types";
import { useTranslations } from "next-intl";

type Props = {
  articles: Article[];
  title?: string;
};

export default function MostReadArticles({ articles, title }: Props) {
  const t = useTranslations("mostRead");

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <Heading level="h2" size="lg" className="mb-8">
        {title || t("title")}
      </Heading>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, index) => (
          <li key={article.id} className="relative">
            <div className="absolute left-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-stone-900">
              {index + 1}
            </div>
            <Card
              title={article.title}
              image={typeof article.image === "object" ? (article.image as Media) : undefined}
              href={`/articles/${article.slug}`}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
