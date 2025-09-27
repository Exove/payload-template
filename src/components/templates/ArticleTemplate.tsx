"use client";

import { BlockRenderer, NodeTypes } from "@/components/BlockRenderer";
import Breadcrumb from "@/components/Breadcrumb";
import ImageModal from "@/components/ImageModal";
import { formatDateShort } from "@/lib/utils";
import { Article } from "@/payload-types";
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
      <div className="mb-6">
        <Breadcrumb />
      </div>
      <Heading level="h1" size="xl">
        {article.title}
      </Heading>
      {typeof article.image === "object" && article.image?.url && (
        <>
          <figure className="mb-8">
            <button
              onClick={() => setIsModalOpen(true)}
              className="block w-full cursor-zoom-in"
              aria-label={t("common.openFullScreen", {
                alt: article.image.alt,
              })}
            >
              <Image
                src={article.image.url}
                alt={article.image.alt}
                width={800}
                height={1200}
                className="aspect-[3/2] w-full max-w-[800px] rounded-lg object-cover sm:aspect-video"
                priority
                sizes="(max-width: 800px) 100vw, 800px"
              />
            </button>
            {article.image.caption && (
              <figcaption className="mt-2 text-center text-sm text-stone-400">
                {article.image.caption}
              </figcaption>
            )}
          </figure>
          <ImageModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            src={article.image.url}
            alt={article.image.alt}
            caption={article.image.caption || undefined}
            width={article.image.width || 1920}
            height={article.image.height || 1080}
          />
        </>
      )}
      <div className="mx-auto max-w-prose">
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

        <BlockRenderer context="article" nodes={article.content?.root?.children as NodeTypes[]} />
        <ShareButtons />
      </div>
    </main>
  );
}
