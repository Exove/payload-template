import { Field } from "payload";

export const slugField = (sourceField: string = "title"): Field[] => [
  {
    name: "slug",
    type: "text",
    required: true,
    unique: true,
    admin: {
      position: "sidebar",
      description: `The slug is automatically generated from the ${sourceField} if empty`,
    },
    hooks: {
      beforeValidate: [
        ({ data, value }: { data?: Record<string, unknown>; value?: string }) => {
          if (!value && data?.[sourceField]) {
            return String(data[sourceField])
              .toLowerCase()
              .replace(/ä/g, "a")
              .replace(/ö/g, "o")
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "");
          }
          return value;
        },
      ],
    },
  },
];
