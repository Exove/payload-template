import Container from "@/components/Container";
import Header from "@/components/Header";
import SearchTemplate from "@/components/templates/SearchTemplate";

export default async function SearchPage() {
  return (
    <Container>
      <Header />
      <SearchTemplate />
    </Container>
  );
}
