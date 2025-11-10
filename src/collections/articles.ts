import { defaultContentFields } from "@/fields/default-content-fields";
import { routing } from "@/i18n/routing";
import { revalidatePath } from "next/cache";
import { CollectionConfig } from "payload";
import { indexToAlgoliaHook, removeFromAlgoliaHook } from "./hooks/indexToAlgolia";

const revalidateArticleHook = async ({ doc }: { doc: { slug: string } }) => {
  routing.locales.forEach((locale) => {
    revalidatePath(`/${locale}/articles/${doc.slug}`);
    revalidatePath(`/${locale}/articles`);
  });
};

export const Articles: CollectionConfig = {
  slug: "articles",
  defaultPopulate: {
    slug: true,
    title: true,
    collection: true,
    image: true,
    tenant: true,
  },
  admin: {
    useAsTitle: "title",
    group: "Pages",
    defaultColumns: ["title", "tenant", "_status", "createdBy", "updatedAt"],
    preview: (doc, { locale }) => {
      if (doc?.slug) {
        return `/${locale}/articles/${doc.slug}/preview?token=${process.env.PREVIEW_SECRET}`;
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
        description: "You can override the default date with a custom date",
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
    afterChange: [indexToAlgoliaHook, revalidateArticleHook],
    afterDelete: [removeFromAlgoliaHook, revalidateArticleHook],
  },
};
