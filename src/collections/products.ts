import { slugField } from "@/fields/slug-field";
import type { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    group: "Multi-tenant",
    useAsTitle: "title",
    defaultColumns: ["title", "status", "price", "launchDate", "updatedAt"],
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "sku",
      type: "text",
      admin: {
        description: "Unique identifier visible in branch specific storefronts.",
      },
    },
    ...slugField("title"),
    {
      name: "status",
      type: "select",
      defaultValue: "draft",
      required: true,
      options: [
        {
          label: "Draft",
          value: "draft",
        },
        {
          label: "In Review",
          value: "in-review",
        },
        {
          label: "Active",
          value: "active",
        },
        {
          label: "Retired",
          value: "retired",
        },
      ],
      admin: {
        description: "Used to control product lifecycle per branch.",
      },
    },
    {
      name: "summary",
      type: "textarea",
      localized: true,
    },
    {
      name: "description",
      type: "richText",
      localized: true,
    },
    {
      type: "row",
      fields: [
        {
          name: "price",
          type: "number",
          min: 0,
          required: true,
        },
        {
          name: "currency",
          type: "select",
          defaultValue: "EUR",
          options: [
            {
              label: "Euro",
              value: "EUR",
            },
            {
              label: "US Dollar",
              value: "USD",
            },
          ],
        },
        {
          name: "launchDate",
          type: "date",
          admin: {
            date: {
              pickerAppearance: "dayOnly",
            },
          },
        },
      ],
    },
    {
      name: "categories",
      type: "relationship",
      relationTo: "categories",
      hasMany: true,
    },
    {
      name: "primaryImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "gallery",
      type: "array",
      admin: {
        description: "Branch specific supporting imagery.",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "caption",
          type: "text",
          localized: true,
        },
      ],
    },
    {
      name: "features",
      type: "array",
      labels: {
        singular: "Feature",
        plural: "Features",
      },
      fields: [
        {
          name: "label",
          type: "text",
          localized: true,
          required: true,
        },
        {
          name: "value",
          type: "text",
          localized: true,
        },
      ],
    },
    {
      name: "availability",
      type: "checkbox",
      defaultValue: true,
      label: "Available for ordering",
    },
    {
      name: "isFeatured",
      type: "checkbox",
      label: "Highlight in branch storefront",
      defaultValue: false,
    },
    {
      name: "supportContact",
      type: "relationship",
      relationTo: "contacts",
      admin: {
        description: "Assigned point of contact for this product within the branch.",
      },
    },
    {
      name: "attachments",
      type: "array",
      fields: [
        {
          name: "asset",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "label",
          type: "text",
          localized: true,
        },
      ],
    },
  ],
};
