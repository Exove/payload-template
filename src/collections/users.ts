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
      return user?.role === "admin";
    },
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
  ],
};
