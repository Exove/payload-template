import { slugField } from "@/fields/slug";
import { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  folders: true,
  admin: {
    group: "Taxonomy",
    useAsTitle: "label",
    defaultColumns: ["label", "slug", "updatedAt", "folder"],
  },
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
