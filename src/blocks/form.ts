import type { Block } from "payload";

export const formBlock: Block = {
  slug: "form",
  interfaceName: "FormBlock",
  labels: {
    singular: "Form",
    plural: "Forms",
  },
  fields: [
    {
      name: "form",
      type: "relationship",
      relationTo: "forms",
      required: true,
    },
  ],
};
