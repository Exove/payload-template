import { linkFieldWithLabel } from "@/fields/link-field";
import { Block } from "payload";

export const linkListBlock: Block = {
  slug: "linkList",
  fields: [
    {
      name: "links",
      type: "array",
      fields: [...linkFieldWithLabel],
    },
  ],
  interfaceName: "LinkListBlock",
};
