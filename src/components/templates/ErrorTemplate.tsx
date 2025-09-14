import { getTranslations } from "next-intl/server";
import Container from "../Container";
import ErrorCapture from "../ErrorCapture";
import Header from "../Header";

export default async function ErrorTemplate({ error }: { error: Error }) {
  const t = await getTranslations();
  return (
    <Container>
      <ErrorCapture error={error} />
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
