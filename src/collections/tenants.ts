import { slugField } from "@/fields/slug-field";
import type { CollectionConfig } from "payload";

export const TenantsSlug = "tenants";

export const Tenants: CollectionConfig = {
  slug: TenantsSlug,
  admin: {
    group: "Multi-tenant",
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "defaultLocale", "updatedAt"],
    description: "Special branches available in the multi-tenant demo.",
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => req.user?.role === "admin",
    update: ({ req }) => req.user?.role === "admin",
    delete: ({ req }) => req.user?.role === "admin",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    ...slugField("name"),
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "defaultLocale",
      type: "select",
      required: true,
      defaultValue: "fi",
      options: [
        {
          label: "Finnish",
          value: "fi",
        },
        {
          label: "English",
          value: "en",
        },
      ],
    },
    {
      name: "domains",
      type: "array",
      admin: {
        description: "Hostnames or paths routed to this branch.",
      },
      fields: [
        {
          name: "domain",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "theme",
      type: "group",
      admin: {
        description: "Optional styling overrides per branch.",
      },
      fields: [
        {
          name: "primaryColor",
          type: "text",
        },
        {
          name: "accentColor",
          type: "text",
        },
        {
          name: "logo",
          type: "upload",
          relationTo: "media",
        },
      ],
    },
    {
      name: "featureFlags",
      type: "select",
      hasMany: true,
      admin: {
        isClearable: true,
      },
      options: [
        {
          label: "Enable beta UI",
          value: "beta-ui",
        },
        {
          label: "Allow experimental products",
          value: "exp-products",
        },
      ],
    },
  ],
};
