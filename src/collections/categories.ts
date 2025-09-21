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

            // If category has a folder, get full folder path
            if (data.folder) {
              try {
                const getFolderPath = async (folderId: number): Promise<string> => {
                  const folder = await req.payload.findByID({
                    collection: "payload-folders",
                    id: folderId,
                  });

                  // If this folder has a parent folder, get its path too
                  if (folder.folder) {
                    const parentFolderId =
                      typeof folder.folder === "number" ? folder.folder : folder.folder.id;
                    const parentPath = await getFolderPath(parentFolderId);
                    return `${parentPath} / ${folder.name}`;
                  }

                  return folder.name;
                };

                const folderPath = await getFolderPath(data.folder);
                return `${folderPath} / ${data.label}`;
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
