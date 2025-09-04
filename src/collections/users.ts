import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
    group: "Misc",
  },
  auth: true,
  access: {
    admin: ({ req: { user } }) => {
      return user?.role === "admin" || user?.role === "editor";
    },
    read: ({ req: { user } }) => user?.role === "admin",
    create: ({ req: { user } }) => user?.role === "admin",
    update: ({ req: { user } }) => user?.role === "admin",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    {
      name: "role",
      type: "select",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
        { label: "User", value: "user" },
      ],
      required: true,
      defaultValue: "user",
    },
    {
      name: "googleId",
      type: "text",
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
  ],
};
