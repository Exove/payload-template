import Container from "@/components/Container";
import Header from "@/components/Header";
import SearchTemplate from "@/components/templates/SearchTemplate";
import { Locale } from "@/types/locales";
import { setRequestLocale } from "next-intl/server";

export const dynamic = "force-static";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export default async function SearchPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Container>
      <Header />
      <SearchTemplate />
    </Container>
  );
}
