import { Block } from "payload";
import { richTextFields } from "../fields/rich-text-field";

export const richTextBlock: Block = {
  slug: "richText",
  fields: richTextFields,
  interfaceName: "RichTextBlock",
};
