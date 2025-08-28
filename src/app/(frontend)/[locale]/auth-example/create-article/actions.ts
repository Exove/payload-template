"use server";

import { Article } from "@/payload-types";
import { auth } from "@clerk/nextjs/server";
import { getPayload } from "payload";

async function getConfig() {
  const { default: configPromise } = await import("@/payload.config");
  return configPromise;
}

export async function fetchUserArticles() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }
  const config = await getConfig();
  const payload = await getPayload({
    config,
  });

  const response = await payload.find({
    collection: "articles",
    where: {
      createdByClerkId: {
        equals: userId,
      },
      _status: {
        equals: "published",
      },
    },
  });

  return response.docs as Article[];
}

export async function createArticle(title: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }
  const config = await getConfig();
  const payload = await getPayload({
    config,
  });

  await payload.create({
    collection: "articles",
    data: {
      title,
      slug: title
        .toLowerCase()
        .replace(/ä/g, "a")
        .replace(/ö/g, "o")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
      _status: "published",
      createdByClerkId: userId,
    },
  });
}

export async function deleteArticle(articleId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }
  const config = await getConfig();
  const payload = await getPayload({
    config,
  });

  // Verify ownership before delete
  const existing = await payload.findByID({
    collection: "articles",
    id: articleId,
  });
  if (existing?.createdByClerkId !== userId) {
    throw new Error("Forbidden");
  }

  await payload.delete({
    collection: "articles",
    id: articleId,
  });
}
