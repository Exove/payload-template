import { slugField } from "@/fields/slug";
import { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  folders: true,
  admin: {
    group: "Taxonomy",
    useAsTitle: "displayName",
    defaultColumns: ["label", "slug", "updatedAt", "folder"],
  },
  fields: [
    {
      name: "label",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "displayName",
      type: "text",
      admin: {
        readOnly: true,
        description: "Auto-generated display name with folder path",
      },
      hooks: {
        beforeChange: [
          async ({ data, req }) => {
            if (!data?.label) return data?.displayName || "";

            // If category has a folder, get folder name and create path
            if (data.folder) {
              try {
                const folder = await req.payload.findByID({
                  collection: "payload-folders",
                  id: data.folder,
                });
                return `${folder.name} / ${data.label}`;
              } catch {
                return data.label;
              }
            }

            return data.label;
          },
        ],
      },
    },
    ...slugField("label"),
  ],
};
