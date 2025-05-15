import { defaultContentFields } from "@/fields/default-content-fields";
import { revalidatePath } from "next/cache";
import { CollectionAfterChangeHook, CollectionConfig } from "payload";
import { indexToElasticHook, removeFromElasticHook } from "./hooks/indexToElastic";

const revalidateArticleHook: CollectionAfterChangeHook = async ({ doc, operation }) => {
  if (operation === "create" || operation === "update" || operation === "delete") {
    revalidatePath(`/fi/articles/${doc.slug}`);
    revalidatePath(`/en/articles/${doc.slug}`);
  }
};

export const Articles: CollectionConfig = {
  slug: "articles",
  admin: {
    useAsTitle: "title",
    group: "Pages",
    defaultColumns: ["title", "createdBy", "updatedAt", "createdAt"],
    preview: (doc, { locale }) => {
      if (doc?.slug) {
        return `/${locale}/articles/${doc.slug}?preview=${process.env.PREVIEW_SECRET}`;
      }
      return null;
    },
  },
  fields: [
    ...defaultContentFields,
    {
      name: "author",
      type: "relationship",
      relationTo: "contacts",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "categories",
      type: "relationship",
      relationTo: "categories",
      hasMany: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "publishedDate",
      type: "date",
      admin: {
        position: "sidebar",
        date: {
          pickerAppearance: "dayOnly",
        },
      },
    },
    {
      name: "collection",
      type: "text",
      defaultValue: "articles",
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
  ],
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [indexToElasticHook, revalidateArticleHook],
    afterDelete: [removeFromElasticHook],
  },
};
