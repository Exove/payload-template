import Heading from "@/components/Heading";
import { Article } from "@/payload-types";
import { useTranslations } from "next-intl";
import Link from "next/link";

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
      <Heading level="h2" size="lg" className="mb-6">
        {title || t("title")}
      </Heading>
      <ol className="ml-4">
        {articles.map((article, index) => (
          <li key={article.id}>
            <Link
              href={`/articles/${article.slug}`}
              className="group inline-flex items-start gap-4 py-4 transition-colors"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-stone-400 text-sm font-bold text-stone-300 group-hover:text-amber-600">
                {index + 1}
              </span>
              <span className="text-lg font-medium">{article.title}</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
