"use client";

import { BlockRenderer } from "@/components/BlockRenderer";
import Button from "@/components/Button";
import MostReadArticles from "@/components/MostReadArticles";
import { Link } from "@/i18n/routing";
import { parseLink } from "@/lib/parse-link";
import { Article, FrontPage } from "@/payload-types";
import Image from "next/image";
import Heading from "../Heading";

type FrontPageTemplateProps = {
  content: FrontPage;
  mostReadArticles?: Article[];
};

export default function FrontPageTemplate({
  content,
  mostReadArticles = [],
}: FrontPageTemplateProps) {
  const hero = content.hero?.[0];
  const { linkUrl, linkLabel } = parseLink(hero?.link);

  return (
    <main id="main-content">
      {hero && (
        <section className="mb-24 mt-12 grid gap-8 lg:grid-cols-2">
          <div className="order-2 flex flex-col items-center justify-center lg:order-1 lg:items-start">
            <div>
              <Heading level="h1" size="xl">
                {hero.title}
              </Heading>
              <p className="mb-6 text-lg">{hero.description}</p>
              {linkUrl && (
                <Button asChild={true}>
                  <Link href={linkUrl}>{linkLabel}</Link>
                </Button>
              )}
            </div>
          </div>
          {typeof hero.image === "object" && hero.image?.url && (
            <div className="relative order-1 aspect-video overflow-hidden rounded-2xl lg:order-2">
              <Image
                src={hero.image.url}
                alt={hero.image.alt || hero.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectPosition: `${hero.image.focalX}% ${hero.image.focalY}%` }}
                priority
              />
            </div>
          )}
        </section>
      )}
      <MostReadArticles articles={mostReadArticles} />
      <div className="mx-auto max-w-screen-lg">
        {content.content && <BlockRenderer blocks={content.content} />}
      </div>
    </main>
  );
}
