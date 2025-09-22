import { Block } from "payload";

export const accordionBlock: Block = {
  slug: "accordion",
  labels: {
    singular: "Accordion",
    plural: "Accordions",
  },
  fields: [
    {
      name: "items",
      type: "array",
      label: "Accordion Items",
      minRows: 1,
      required: true,
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          label: "Item Title",
        },
        {
          name: "content",
          type: "richText",
          required: true,
          label: "Item Content",
        },
      ],
    },
  ],
  interfaceName: "AccordionBlock",
};
