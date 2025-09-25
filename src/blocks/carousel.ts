import { linkField } from "@/fields/link-field";
import { Block } from "payload";

export const carouselBlock: Block = {
  slug: "carousel",
  labels: {
    singular: "Carousel",
    plural: "Carousels",
  },
  fields: [
    {
      name: "items",
      type: "array",
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "link",
          type: "group",
          fields: [...linkField],
        },
      ],
      required: true,
      minRows: 1,
    },
  ],
  interfaceName: "CarouselBlock",
};
