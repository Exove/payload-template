import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant/fields";
import type { CollectionConfig } from "payload";

import { TenantsSlug } from "./tenants";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    group: "Misc",
    useAsTitle: "email",
    defaultColumns: ["email", "role", "tenants"],
    description: "Demo accounts for multi-tenant branches.",
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
        { label: "Global Admin", value: "admin" },
        { label: "Global Editor", value: "editor" },
        { label: "Global User", value: "user" },
      ],
      required: true,
      defaultValue: "user",
      admin: {
        description: "Determines platform level access across all branches.",
      },
    },
    tenantsArrayField({
      tenantsCollectionSlug: TenantsSlug,
      rowFields: [
        {
          name: "role",
          type: "select",
          required: true,
          defaultValue: "tenant-viewer",
          options: [
            {
              label: "Tenant Admin",
              value: "tenant-admin",
            },
            {
              label: "Tenant Editor",
              value: "tenant-editor",
            },
            {
              label: "Tenant Viewer",
              value: "tenant-viewer",
            },
          ],
        },
        {
          name: "canPublish",
          type: "checkbox",
          label: "Can publish content",
          defaultValue: false,
        },
        {
          name: "canManageMembers",
          type: "checkbox",
          label: "Can manage branch members",
          defaultValue: false,
        },
      ],
    }),
  ],
};
