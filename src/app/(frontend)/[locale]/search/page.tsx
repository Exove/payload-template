import Container from "@/components/Container";
import Header from "@/components/Header";
import SearchTemplate from "@/components/templates/SearchTemplate";
import { Locale } from "@/types/locales";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export default async function SearchPage({ params }: Props) {
  const { locale } = await params;
  return (
    <Container>
      <Header locale={locale} />
      <SearchTemplate locale={locale} />
    </Container>
  );
}
