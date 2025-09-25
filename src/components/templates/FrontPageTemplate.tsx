import { BlockRenderer } from "@/components/BlockRenderer";
import Button from "@/components/Button";
import Heading from "@/components/Heading";
import { Link } from "@/i18n/routing";
import { parseLink } from "@/lib/parse-link";
import { FrontPage } from "@/payload-types";
import Image from "next/image";

type FrontPageTemplateProps = {
  content: FrontPage;
};

export default function FrontPageTemplate({ content }: FrontPageTemplateProps) {
  const hero = content.hero?.[0];
  const { linkUrl, linkLabel } = parseLink(hero?.link);

  return (
    <main id="main-content">
      {hero && (
        <section className="mb-24 mt-12 grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center justify-center lg:items-start">
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
            <div className="relative aspect-video overflow-hidden rounded-lg">
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
