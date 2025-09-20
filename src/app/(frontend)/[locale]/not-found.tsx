import Button from "@/components/Button";
import Container from "@/components/Container";
import Header from "@/components/Header";
import Heading from "@/components/Heading";
import { getTranslations } from "next-intl/server";

export default async function NotFoundTemplate() {
  const t = await getTranslations("notFound");

  return (
    <Container>
      <Header />
      <main
        id="main-content"
        className="mx-auto flex max-w-screen-md flex-col items-center justify-center gap-8 py-16 text-center"
      >
        <Heading level="h1" size="lg" className="mb-4">
          {`404 - ${t("title")}`}
        </Heading>
        <p className="mb-8 text-stone-400">{t("description")}</p>
        <Button href="/">{t("backHome")}</Button>
      </main>
    </Container>
  );
}
