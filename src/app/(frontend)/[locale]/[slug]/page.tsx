import { BlockRenderer, NodeTypes } from "@/components/BlockRenderer";
import Card from "@/components/Card";
import Container from "@/components/Container";
import Header from "@/components/Header";
import Heading from "@/components/Heading";
import ErrorTemplate from "@/components/templates/ErrorTemplate";
import { SITE_NAME } from "@/lib/constants";
import { prepareOpenGraphImages } from "@/lib/utils";
import { Article, CollectionPage, Media } from "@/payload-types";
import configPromise from "@payload-config";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPayload } from "payload";

export const dynamic = "force-static";
export const revalidate = 60;

type Props = {
  params: Promise<{ locale: "fi" | "en"; slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getCollectionPageBySlug({ params }: Props) {
  try {
    const { slug, locale } = await params;
    const payload = await getPayload({ config: configPromise });

    const result = await payload.find({
      collection: "collection-pages",
      where: { slug: { equals: slug } },
      locale,
      draft: false,
      depth: 2,
    });

    return { page: result.docs[0] as CollectionPage | undefined, error: null };
  } catch (error) {
    console.error("Error fetching collection page:", error);
    return { page: null, error: error as Error };
  }
}

export default async function CollectionPageRoute(props: Props) {
  const { page, error } = await getCollectionPageBySlug(props);

  if (error) {
    return <ErrorTemplate error={error} />;
  }

  if (!page) {
    notFound();
  }

  const subPages = Array.isArray(page.subPages) ? page.subPages : [];

  return (
    <Container>
      <Header />
      <main id="main-content" className="mx-auto max-w-screen-lg py-16">
        <Heading level="h1" size="lg" className="mb-6">
          {page.title}
        </Heading>

        <div className="mx-auto max-w-prose">
          {page.description && <p className="mb-6 text-stone-300">{page.description}</p>}
        </div>

        <div className="mx-auto max-w-screen-lg">
          <BlockRenderer nodes={page.content?.root?.children as NodeTypes[]} />
        </div>

        {subPages.length > 0 && (
          <section className="mt-12">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {subPages.map((item) => {
                if (typeof item !== "object") return null;
                const article = item as Article;
                const image =
                  typeof article.image === "object" ? (article.image as Media) : undefined;
                return (
                  <Card
                    key={article.id}
                    image={image}
                    title={article.title}
                    text={article.description || undefined}
                    href={`/articles/${article.slug}`}
                  />
                );
              })}
            </div>
          </section>
        )}
      </main>
    </Container>
  );
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const { page } = await getCollectionPageBySlug(props);
    const openGraphImages = prepareOpenGraphImages(page?.image);

    return {
      title: (page?.title ? `${page.title} | ${SITE_NAME}` : SITE_NAME) as string,
      description: (page?.description as string) || undefined,
      openGraph: openGraphImages ? { images: openGraphImages } : undefined,
    };
  } catch (error) {
    console.error("Error generating metadata for collection page:", error);
    return { title: SITE_NAME };
  }
}
