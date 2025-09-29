import Container from "@/components/Container";
import Header from "@/components/Header";
import SearchTemplate from "@/components/templates/SearchTemplate";

export const dynamic = "force-dynamic";

export default async function SearchPage() {
  return (
    <Container>
      <Header />
      <SearchTemplate />
    </Container>
  );
}
