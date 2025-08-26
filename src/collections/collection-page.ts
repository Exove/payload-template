import { defaultContentFields } from "@/fields/default-content-fields";
import { CollectionConfig } from "payload";

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
};
