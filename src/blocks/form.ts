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
    {
      name: "enableIntro",
      label: "Enable Intro Content",
      type: "checkbox",
    },
    {
      name: "introContent",
      label: "Intro Content",
      type: "richText",
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.enableIntro),
      },
    },
  ],
};
