import { slugField } from "@/fields/slug";
import { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    group: "Misc",
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
