import { BlockRenderer, NodeTypes } from "@/components/BlockRenderer";
import { Link } from "@/i18n/routing";
import { formatDateShort } from "@/lib/utils";
import { Article } from "@/payload-types";
import { Locale } from "@/types/locales";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Heading from "../Heading";
import ShareButtons from "../ShareButtons";

interface ArticleTemplateProps {
  article: Article;
  locale: Locale;
  t: {
    title: string;
    share: {
      title: string;
      copied: string;
      copyLink: string;
    };
  };
}

export default function ArticleTemplate({ article, locale, t }: ArticleTemplateProps) {
  return (
    <main id="main-content" className="mx-auto max-w-[800px] py-12">
      <div className="mb-6 flex items-center gap-2 text-sm text-stone-400 hover:text-stone-300">
        <ChevronLeftIcon className="size-4 stroke-2" />
        <Link href="/articles" locale={locale}>
          {t.title}
        </Link>
      </div>
      {typeof article.image === "object" && article.image?.url && (
        <Image
          src={article.image.sizes?.large?.url || article.image.url}
          alt={article.image.alt || ""}
          width={1920}
          height={1080}
          className="mb-10 aspect-video w-full max-w-[800px] rounded-lg object-cover"
          priority
        />
      )}
      <Heading level="h1" size="lg" className="mb-6">
        {article.title}
      </Heading>
      {(article.publishedDate || article.author) && (
        <div className="mb-12 flex gap-4 text-sm text-stone-400">
          {article.publishedDate && (
            <time dateTime={article.publishedDate || ""}>
              {formatDateShort(article.publishedDate || "", locale)}
            </time>
          )}
          {article.author && article.publishedDate && <span>•</span>}
          {article.author && typeof article.author === "object" && (
            <span>{article.author?.name}</span>
          )}
        </div>
      )}
      <div className="mx-auto max-w-screen-lg">
        <BlockRenderer nodes={article.content?.root?.children as NodeTypes[]} />
        <div className="mt-10">
          <ShareButtons t={t.share} />
        </div>
      </div>
    </main>
  );
}
