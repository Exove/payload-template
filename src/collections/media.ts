// import { generateImageAltText } from "@/components/admin-ui/AltTextGenerator/actions";
import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === "admin",
    update: ({ req: { user } }) => user?.role === "admin",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  admin: {
    group: "Misc",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      localized: true,
    },
  ],
  upload: {
    adminThumbnail: "medium",
    imageSizes: [
      {
        name: "tiny",
        width: 100,
        height: 100,
        formatOptions: {
          format: "webp",
          options: {
            quality: 85,
          },
        },
        withoutEnlargement: true,
      },
      {
        name: "medium",
        width: 640,
        formatOptions: {
          format: "webp",
          options: {
            quality: 85,
          },
        },
        withoutEnlargement: true,
      },
      {
        name: "large",
        width: 1024,
        formatOptions: {
          format: "webp",
          options: {
            quality: 85,
          },
        },
        withoutEnlargement: true,
      },
    ],
    resizeOptions: {
      fit: "cover",
      position: "center",
    },
  },
};
