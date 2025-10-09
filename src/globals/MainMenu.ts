import { linkField } from "@/fields/link-field";
import { revalidatePath } from "next/cache";
import { GlobalAfterChangeHook, GlobalConfig } from "payload";

const revalidateMainMenuHook: GlobalAfterChangeHook = async () => {
  revalidatePath("/", "layout"); // Revalidating all data
};

// Validate that if addLinks is true, label is required
const labelValidation = (
  value: string | undefined | null,
  { siblingData }: { siblingData: { addLinks?: boolean } },
) => {
  if (siblingData.addLinks && !value) {
    return "Label is required";
  }
  return true;
};

const labelAdminConfig = {
  description:
    "You can override the link label here. If this is a parent menu item, label is required.",
};

export const MainMenu: GlobalConfig = {
  slug: "main-menu",
  access: {
    read: () => true,
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
          localized: true,
          validate: labelValidation,
          admin: labelAdminConfig,
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
              localized: true,
              validate: labelValidation,
              admin: labelAdminConfig,
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
                  localized: true,
                  validate: labelValidation,
                  admin: labelAdminConfig,
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
