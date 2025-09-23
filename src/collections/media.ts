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
    adminThumbnail: "adminThumbnail",
    imageSizes: [
      {
        name: "adminThumbnail",
        width: 640,
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
      width: 1600,
      height: 1200,
      fit: "inside",
      position: "center",
      withoutEnlargement: true,
    },
  },
};
