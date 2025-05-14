import { GlobalConfig } from "payload";

export const Footer: GlobalConfig = {
  slug: "footer",
  access: {
    read: () => true,
  },
  admin: {
    group: "Misc",
    hidden: true,
  },
  fields: [
    {
      name: "general",
      type: "group",
      fields: [
        {
          name: "title",
          type: "text",
          localized: true,
        },
        {
          name: "description",
          type: "text",
          localized: true,
        },
        {
          name: "social",
          type: "group",
          fields: [
            {
              name: "facebook",
              type: "text",
              admin: { description: "Link URL" },
            },
            {
              name: "instagram",
              type: "text",
              admin: { description: "Link URL" },
            },
            {
              name: "linkedin",
              type: "text",
              admin: { description: "Link URL" },
            },
            {
              name: "youtube",
              type: "text",
              admin: { description: "Link URL" },
            },
          ],
        },
      ],
    },
    {
      name: "contact",
      type: "group",
      fields: [
        { name: "title", type: "text" },
        { name: "address", type: "text" },
        { name: "postalCode", type: "text" },
        { name: "city", type: "text" },
        { name: "phone", type: "text" },
        { name: "email", type: "text" },
      ],
    },
    {
      name: "copyright",
      type: "text",
      localized: true,
    },
  ],
};
