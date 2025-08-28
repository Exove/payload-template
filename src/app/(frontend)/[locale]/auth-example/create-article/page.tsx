import Container from "@/components/Container";
import Header from "@/components/Header";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchUserArticles } from "./actions";
import CreateArticle from "./create-article-temp";

export default async function CreateArticlePage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/en/auth-example/login");
  }

  const initialArticles = await fetchUserArticles();

  return (
    <Container>
      <Header />
      <CreateArticle initialArticles={initialArticles} />
    </Container>
  );
}
