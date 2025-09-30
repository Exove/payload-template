"use client";

import { BlockRenderer } from "@/components/BlockRenderer";
import Button from "@/components/Button";
import { Link } from "@/i18n/routing";
import { parseLink } from "@/lib/parse-link";
import { FrontPage } from "@/payload-types";
import { motion } from "motion/react";
import Image from "next/image";

type FrontPageTemplateProps = {
  content: FrontPage;
};

export default function FrontPageTemplate({ content }: FrontPageTemplateProps) {
  const hero = content.hero?.[0];
  const { linkUrl, linkLabel } = parseLink(hero?.link);

  const titleWords = hero?.title?.split(" ") || [];

  return (
    <main id="main-content">
      {hero && (
        <section className="mb-24 mt-12 grid gap-8 lg:grid-cols-2">
          <div className="order-2 flex flex-col items-center justify-center lg:order-1 lg:items-start">
            <div>
              <motion.h1 className="mb-10 text-3xl font-bold lg:text-4xl xl:text-5xl">
                {titleWords.map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="mr-[0.25em] inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h1>
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
      <div className="mx-auto max-w-screen-lg">
        {content.content && <BlockRenderer blocks={content.content} />}
      </div>
    </main>
  );
}
