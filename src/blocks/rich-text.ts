import { Block } from "payload";

export const richTextBlock: Block = {
  slug: "richText",
  fields: [
    {
      name: "content",
      type: "richText",
      required: true,
    },
  ],
  interfaceName: "RichTextBlock",
};
