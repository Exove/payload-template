import { linkFieldWithLabel } from "@/fields/link-field";
import { revalidatePath } from "next/cache";
import { GlobalAfterChangeHook, GlobalConfig } from "payload";

const revalidateFooterMenuHook: GlobalAfterChangeHook = async () => {
  revalidatePath("/", "layout"); // Revalidating all data
};

export const FooterMenu: GlobalConfig = {
  slug: "footer-menu",
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
          label: "Title",
          type: "text",
          required: true,
          localized: true,
        },
        {
          name: "children",
          type: "array",
          fields: [
            {
              name: "link",
              type: "group",
              fields: linkFieldWithLabel,
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooterMenuHook],
  },
};
