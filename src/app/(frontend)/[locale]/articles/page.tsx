import Container from "@/components/Container";
import Header from "@/components/Header";
import ErrorTemplate from "@/components/templates/ErrorTemplate";
import { ListingTemplate } from "@/components/templates/ListingTemplate";
import { SITE_NAME } from "@/lib/constants";
import { Locale } from "@/types/locales";
import configPromise from "@payload-config";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPayload } from "payload";

export const dynamic = "force-static";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export default async function ArticlesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const articles = await payload.find({
      collection: "articles",
      sort: "-publishedDate",
      locale: locale,
      fallbackLocale: false,
      draft: false,
      pagination: false, // Get all articles
      depth: 0,
      select: {
        id: true,
        title: true,
        slug: true,
        publishedDate: true,
      },
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
        <ListingTemplate articles={articles.docs} locale={locale} />
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
