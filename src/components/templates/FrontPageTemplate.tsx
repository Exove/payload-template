import { BlockRenderer } from "@/components/BlockRenderer";
import Button from "@/components/Button";
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
        <section className="py-8">
          <div className="mx-auto max-w-screen-lg px-4">
            <h1 className="mb-4 text-3xl font-bold">{hero.title}</h1>
            <p className="mb-6 text-lg">{hero.description}</p>
            {typeof hero.image === "object" && hero.image?.url && (
              <div className="mb-6">
                <Image
                  src={hero.image.url}
                  alt={hero.image.alt || hero.title}
                  width={800}
                  height={400}
                  className="rounded-lg"
                />
              </div>
            )}
            {linkUrl && (
              <Button asChild={true}>
                <Link href={linkUrl}>{linkLabel}</Link>
              </Button>
            )}
          </div>
        </section>
      )}
      <div className="mx-auto max-w-screen-lg py-16">
        {content.content && <BlockRenderer blocks={content.content} />}
      </div>
    </main>
  );
}
