import Container from "@/components/Container";
import Header from "@/components/Header";
import TopBanner from "@/components/TopBanner";
import ArticleTemplate from "@/components/templates/ArticleTemplate";
import ErrorTemplate from "@/components/templates/ErrorTemplate";
import { SITE_NAME } from "@/lib/constants";
import { prepareOpenGraphImages } from "@/lib/utils";
import { Locale } from "@/types/locales";
import configPromise from "@payload-config";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getPayload } from "payload";

export const dynamic = "force-static";

type Props = {
  params: Promise<{ slug: string; locale: Locale }>;
  preview: boolean;
};

export async function getArticleBySlug({ params, preview = false }: Props) {
  try {
    const { locale } = await params;
    const { slug } = await params;

    const payload = await getPayload({
      config: configPromise,
    });

    const result = await payload.find({
      collection: "articles",
      where: {
        slug: { equals: slug },
      },
      locale: locale,
      draft: preview,
    });

    return { article: result.docs[0], error: null };
  } catch (error) {
    console.error("Error fetching article:", error);
    return { article: null, error: error as Error };
  }
}

export default async function ArticlePage(props: Props) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const tArticles = await getTranslations({ locale, namespace: "articles" });
  const tShare = await getTranslations({ locale, namespace: "share" });

  const { article, error } = await getArticleBySlug(props);

  if (error) {
    console.error("Error fetching article:", error);
    return <ErrorTemplate locale={locale} error={error as Error} />;
  }

  if (!article) {
    notFound();
  }

  return (
    <>
      {props.preview && <TopBanner label="Preview" />}
      <Container>
        <Header locale={locale} />
        <ArticleTemplate
          article={article}
          locale={locale}
          t={{
            title: tArticles("title"),
            share: {
              title: tShare("title"),
              copied: tShare("copied"),
              copyLink: tShare("copyLink"),
            },
          }}
        />
      </Container>
    </>
  );
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { article } = await getArticleBySlug(props);
  const openGraphImages = prepareOpenGraphImages(article?.meta?.image || article?.image);

  return {
    title: article?.meta?.title || `${article?.title} | ${SITE_NAME}`,
    description: article?.meta?.description || article?.description,
    openGraph: openGraphImages ? { images: openGraphImages } : undefined,
  };
}
