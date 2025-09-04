import { BlockRenderer, NodeTypes } from "@/components/BlockRenderer";
import Container from "@/components/Container";
import Header from "@/components/Header";
import Heading from "@/components/Heading";
import ErrorTemplate from "@/components/templates/ErrorTemplate";
import { Link } from "@/i18n/routing";
import { SITE_NAME } from "@/lib/constants";
import { prepareOpenGraphImages } from "@/lib/utils";
import { Article, CollectionPage } from "@/payload-types";
import { Locale } from "@/types/locale";
import configPromise from "@payload-config";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPayload } from "payload";

type Props = {
  params: Promise<{ locale: Locale; slug: string }>;
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
        <div className="flex gap-8">
          {subPages.length > 0 && (
            <aside className="w-64 flex-shrink-0">
              <div className="sticky top-8">
                <h2 className="mb-4 text-lg font-semibold">Alasivut</h2>
                <nav>
                  <ul className="space-y-2">
                    {subPages.map((item) => {
                      if (typeof item !== "object") return null;
                      const article = item as Article;
                      return (
                        <li key={article.id}>
                          <Link
                            href={`/articles/${article.slug}`}
                            className="text-blue-300 underline underline-offset-2 hover:text-blue-100"
                          >
                            {article.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>
            </aside>
          )}
          <div className="flex-1">
            <Heading level="h1" size="lg" className="mb-6">
              {page.title}
            </Heading>

            {page.description && (
              <div className="mb-6 max-w-prose">
                <p className="mb-6 text-stone-300">{page.description}</p>
              </div>
            )}

            <div className="max-w-screen-lg">
              <BlockRenderer nodes={page.content?.root?.children as NodeTypes[]} />
            </div>
          </div>
        </div>
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
