import { linkField } from "@/fields/link";
import { revalidatePath } from "next/cache";
import { GlobalAfterChangeHook, GlobalConfig } from "payload";

const revalidateMainMenuHook: GlobalAfterChangeHook = async () => {
  revalidatePath("/", "layout"); // Revalidating all data
};

export const MainMenu: GlobalConfig = {
  slug: "main-menu",
  access: {
    read: ({ req: { user } }) => !user || user?.role === "admin",
    update: ({ req: { user } }) => user?.role === "admin",
  },
  admin: {
    group: "Menus",
  },
  fields: [
    {
      name: "items",
      type: "array",
      required: true,
      localized: true,
      admin: {
        components: {
          RowLabel: "@/components/admin-ui/MainMenuRow#MainMenuRow",
        },
      },
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          localized: true,
        },
        {
          name: "addLinks",
          type: "checkbox",
          label: "This is a parent menu item",
        },
        {
          name: "link",
          type: "group",
          fields: linkField,
          admin: {
            condition: (_, siblingData) => !siblingData.addLinks,
          },
        },
        {
          name: "children",
          type: "array",
          admin: {
            condition: (_, siblingData) => siblingData.addLinks,
          },
          fields: [
            {
              name: "label",
              type: "text",
              required: true,
              localized: true,
            },
            {
              name: "addLinks",
              type: "checkbox",
              label: "This is a parent menu item",
            },
            {
              name: "link",
              type: "group",
              fields: linkField,
              admin: {
                condition: (_, siblingData) => !siblingData.addLinks,
              },
            },
            {
              name: "grandchildren",
              type: "array",
              admin: {
                condition: (_, siblingData) => siblingData.addLinks,
              },
              fields: [
                {
                  name: "label",
                  type: "text",
                  required: true,
                  localized: true,
                },
                {
                  name: "link",
                  type: "group",
                  fields: linkField,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateMainMenuHook],
  },
};
