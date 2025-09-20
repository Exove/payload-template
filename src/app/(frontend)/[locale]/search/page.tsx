import Container from "@/components/Container";
import Header from "@/components/Header";
import SearchTemplate from "@/components/templates/SearchTemplate";

// Force dynamic rendering to enable SSR for search
export const dynamic = "force-dynamic";

export default async function SearchPage() {
  return (
    <Container>
      <Header />
      <SearchTemplate />
    </Container>
  );
}
