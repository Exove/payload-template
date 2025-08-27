import { slugField } from "@/fields/slug";
import { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  access: {
    read: ({ req: { user } }) => !user || user?.role === "admin",
    create: ({ req: { user } }) => user?.role === "admin",
    update: ({ req: { user } }) => user?.role === "admin",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  admin: {
    group: "Taxonomy",
    useAsTitle: "label",
    defaultColumns: ["label", "slug", "parent", "updatedAt"],
  },
  defaultSort: "parent",
  fields: [
    {
      name: "label",
      type: "text",
      required: true,
      localized: true,
    },
    ...slugField("label"),
  ],
};
