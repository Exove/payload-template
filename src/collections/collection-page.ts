import { defaultContentFields } from "@/fields/default-content-fields";
import { revalidatePath } from "next/cache";
import { CollectionAfterChangeHook, CollectionConfig } from "payload";
import { indexToElasticHook, removeFromElasticHook } from "./hooks/indexToElastic";

const revalidateCollectionPageHook: CollectionAfterChangeHook = async ({ doc, operation }) => {
  if (operation === "create" || operation === "update" || operation === "delete") {
    revalidatePath(`/fi/collection-pages/${doc.slug}`);
    revalidatePath(`/en/collection-pages/${doc.slug}`);
  }
};

export const CollectionPage: CollectionConfig = {
  slug: "collection-pages",
  admin: {
    useAsTitle: "title",
    group: "Pages",
    defaultColumns: ["title", "createdBy", "updatedAt", "createdAt"],
    preview: (doc, { locale }) => {
      if (doc?.slug) {
        return `/${locale}/${doc.slug}?preview=${process.env.PREVIEW_SECRET}`;
      }
      return null;
    },
  },
  fields: [
    ...defaultContentFields,
    {
      name: "subPages",
      type: "relationship",
      relationTo: "articles",
      hasMany: true,
      admin: {
        description: "Select sub pages to display on this page",
      },
    },
    {
      name: "collection",
      type: "text",
      defaultValue: "collection-pages",
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
  ],
  hooks: {
    afterChange: [indexToElasticHook, revalidateCollectionPageHook],
    afterDelete: [removeFromElasticHook],
  },
};
