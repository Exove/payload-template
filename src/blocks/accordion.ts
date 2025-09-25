import { Block, RichTextField } from "payload";
import { richTextFields } from "../fields/rich-text-field";

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
          editor: (richTextFields[0] as RichTextField).editor,
        },
      ],
    },
  ],
  interfaceName: "AccordionBlock",
};
