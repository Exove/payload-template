import { linkFieldWithLabel } from "@/fields/link";
import { revalidatePath } from "next/cache";
import { GlobalAfterChangeHook, GlobalConfig } from "payload";

const revalidateFooterMenuHook: GlobalAfterChangeHook = async () => {
  revalidatePath("/", "layout"); // Revalidating all data
};

export const FooterMenu: GlobalConfig = {
  slug: "footer-menu",
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
