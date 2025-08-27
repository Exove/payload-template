import { CollectionConfig } from "payload";

export const Contacts: CollectionConfig = {
  slug: "contacts",
  access: {
    read: ({ req: { user } }) => user?.role === "admin",
    create: ({ req: { user } }) => user?.role === "admin",
    update: ({ req: { user } }) => user?.role === "admin",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  admin: {
    group: "Misc",
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "title",
      type: "text",
      localized: true,
    },
    {
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: "phone",
      type: "text",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
  ],
};
