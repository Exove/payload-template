import { CollectionConfig } from "payload";

export const Contacts: CollectionConfig = {
  slug: "contacts",
  admin: {
    group: "Misc",
    useAsTitle: "name",
    defaultColumns: ["name", "tenant", "email", "updatedAt"],
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
