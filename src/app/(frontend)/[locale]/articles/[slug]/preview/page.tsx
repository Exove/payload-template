import { notFound } from "next/navigation";
import ArticlePage from "../page";

export const dynamic = "force-dynamic";

type Props = {
  params: { slug: string };
  searchParams: { token: string };
};

export default async function PreviewPage({ params, searchParams }: Props) {
  type ArticlePageProps = Parameters<typeof ArticlePage>[0];
  const { token } = searchParams;
  const pageProps: ArticlePageProps = {
    params: Promise.resolve(params),
    preview: token === process.env.PAYLOAD_SECRET,
  };
  if (token !== process.env.PAYLOAD_SECRET) {
    notFound();
  }
  return ArticlePage(pageProps);
}
