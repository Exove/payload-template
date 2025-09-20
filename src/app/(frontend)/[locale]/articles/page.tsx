import Container from "@/components/Container";
import Header from "@/components/Header";
import ErrorTemplate from "@/components/templates/ErrorTemplate";
import { ListingTemplate } from "@/components/templates/ListingTemplate";
import { SITE_NAME } from "@/lib/constants";
import { Locale } from "@/types/locales";
import configPromise from "@payload-config";
import { getTranslations } from "next-intl/server";
import { getPayload } from "payload";

type Props = {
  searchParams: Promise<{ page?: string }>;
  params: Promise<{ locale: Locale }>;
};

const ITEMS_PER_PAGE = 40;

export default async function ArticlesPage({ searchParams, params }: Props) {
  const { locale } = await params;

  try {
    const { page } = await searchParams;
    const currentPage = Number(page) || 1;

    const payload = await getPayload({
      config: configPromise,
    });

    const articles = await payload.find({
      collection: "articles",
      sort: "-publishedDate",
      locale: locale,
      fallbackLocale: false,
      draft: false,
      limit: ITEMS_PER_PAGE,
      page: currentPage,
      depth: 0,
      where: {
        title: {
          exists: true,
          not_equals: "",
        },
      },
    });

    return (
      <Container>
        <Header />
        <ListingTemplate
          articles={articles.docs}
          totalDocs={articles.totalDocs}
          totalPages={articles.totalPages}
          currentPage={currentPage}
          locale={locale}
        />
      </Container>
    );
  } catch (error) {
    console.error("Error fetching articles:", error);
    return <ErrorTemplate error={error as Error} />;
  }
}

export async function generateMetadata() {
  const t = await getTranslations("articles");

  return {
    title: `${t("title")} | ${SITE_NAME}`,
  };
}
