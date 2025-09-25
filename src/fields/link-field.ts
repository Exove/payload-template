import { Field } from "payload";

export const linkField: Field[] = [
  {
    name: "isExternal",
    type: "checkbox",
    label: "External link",
  },
  {
    name: "internalUrl",
    type: "relationship",
    relationTo: ["articles"],
    required: true,
    admin: {
      condition: (_, siblingData) => !siblingData.isExternal,
    },
  },
  {
    name: "externalUrl",
    type: "text",
    required: true,
    admin: {
      condition: (_, siblingData) => siblingData.isExternal,
    },
  },
];

export const linkFieldWithLabel: Field[] = [
  {
    name: "label",
    type: "text",
    admin: {
      description: "If no label is provided, the title of the linked page will be used",
    },
  },
  ...linkField,
];
