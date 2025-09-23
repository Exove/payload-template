"use client";

import { BlockRenderer, NodeTypes } from "@/components/BlockRenderer";
import ImageModal from "@/components/ImageModal";
import { Link } from "@/i18n/routing";
import { formatDateShort } from "@/lib/utils";
import { Article } from "@/payload-types";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import Heading from "../Heading";
import ShareButtons from "../ShareButtons";

export type ArticleTemplateProps = {
  article: Article;
};

export default function ArticleTemplate({ article }: ArticleTemplateProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main id="main-content" className="mx-auto max-w-[800px] py-12">
      <div className="mb-6 flex items-center gap-2 text-sm text-stone-400 hover:text-stone-300">
        <ChevronLeftIcon className="size-4 stroke-2" />
        <Link href="/articles">{t("articles.title")}</Link>
      </div>
      {typeof article.image === "object" && article.image?.url && (
        <>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mb-10 block w-full cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={t("common.openFullScreen", {
              alt: article.image.alt,
            })}
          >
            <Image
              src={article.image.url}
              alt={article.image.alt || ""}
              width={800}
              height={article.image.sizes?.large?.height || 1080}
              className="aspect-video w-full max-w-[800px] rounded-lg object-cover"
              priority
              sizes="(max-width: 800px) 100vw, 800px"
            />
          </button>
          <ImageModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            src={article.image.url}
            alt={article.image.alt || ""}
            caption={article.image.caption || undefined}
            width={article.image.width || 1920}
            height={article.image.height || 1080}
          />
        </>
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
      <div className="mx-auto max-w-screen-lg space-y-20">
        <BlockRenderer nodes={article.content?.root?.children as NodeTypes[]} />
        <ShareButtons />
      </div>
    </main>
  );
}
