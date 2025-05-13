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
  admin: {
    useAsTitle: "title",
    hidden: true,
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
