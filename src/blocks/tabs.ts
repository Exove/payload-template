import { Block } from "payload";

export const tabsBlock: Block = {
  slug: "tabs",
  labels: {
    singular: "Tabs",
    plural: "Tabs",
  },
  fields: [
    {
      name: "tabs",
      type: "array",
      label: "Tab Items",
      minRows: 2,
      required: true,
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          label: "Tab Label",
          admin: {
            description: "The text displayed on the tab button",
          },
        },
        {
          name: "content",
          type: "richText",
          required: true,
          label: "Tab Content",
        },
      ],
    },
  ],
  interfaceName: "TabsBlock",
};
