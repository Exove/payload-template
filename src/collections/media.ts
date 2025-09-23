// import { generateImageAltText } from "@/components/admin-ui/AltTextGenerator/actions";
import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  admin: {
    group: "Misc",
  },
  folders: true,
  fields: [
    {
      name: "alt",
      type: "text",
      localized: true,
      required: true,
    },
    {
      name: "caption",
      type: "text",
      localized: true,
      admin: {
        description: "Optional caption text displayed when image is viewed in modal",
      },
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
