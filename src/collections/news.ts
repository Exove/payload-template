import { defaultContentFields } from "@/fields/default-content-fields";
import { revalidatePath } from "next/cache";
import { CollectionAfterChangeHook, CollectionConfig } from "payload";
import { indexToElasticHook, removeFromElasticHook } from "./hooks/indexToElastic";

const revalidateNewsHook: CollectionAfterChangeHook = async ({ doc, operation }) => {
  if (operation === "create" || operation === "update" || operation === "delete") {
    revalidatePath(`/fi/news/${doc.slug}`);
    revalidatePath(`/en/news/${doc.slug}`);
  }
};

export const News: CollectionConfig = {
  slug: "news",
  access: {
    read: ({ req: { user } }) => !user || user?.role === "admin",
    create: ({ req: { user } }) => user?.role === "admin",
    update: ({ req: { user } }) => user?.role === "admin",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  admin: {
    useAsTitle: "title",
    group: "Pages",
    defaultColumns: ["title", "createdBy", "updatedAt", "createdAt"],
  },
  fields: [
    ...defaultContentFields,
    {
      name: "collection",
      type: "text",
      defaultValue: "news",
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
  ],
  hooks: {
    afterChange: [indexToElasticHook, revalidateNewsHook],
    afterDelete: [removeFromElasticHook],
  },
};
