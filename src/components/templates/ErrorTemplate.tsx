import { getTranslations } from "next-intl/server";
import Container from "../Container";
import Header from "../Header";

type Props = {
  error: Error;
};

export default async function ErrorTemplate({ error }: Props) {
  const t = await getTranslations("common");

  return (
    <Container>
      <Header />
      <main id="main-content" className="mx-auto my-20 max-w-2xl rounded-lg bg-red-50 p-4">
        <h2 className="mb-2 text-lg font-bold text-red-700">
          {t("common.error") || "Error: The page could not be loaded."}
        </h2>
        <p className="text-red-700">{error.message || "Error: The page could not be loaded."}</p>
      </main>
    </Container>
  );
}
