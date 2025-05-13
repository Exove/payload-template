import { mediaBlock, quoteBlock, videoEmbedBlock } from "@/blocks";
import { slugField } from "@/fields/slug";
import { BlocksFeature, HeadingFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { revalidatePath } from "next/cache";
import { CollectionAfterChangeHook, CollectionConfig } from "payload";
import { indexToElasticHook, removeFromElasticHook } from "./hooks/indexToElastic";

const revalidateApartmentHook: CollectionAfterChangeHook = async ({ doc, operation }) => {
  if (operation === "create" || operation === "update" || operation === "delete") {
    revalidatePath(`/fi/apartments/${doc.slug}`);
    revalidatePath(`/en/apartments/${doc.slug}`);
  }
};

export const Apartments: CollectionConfig = {
  slug: "apartments",
  admin: {
    useAsTitle: "title",
    group: "Pages",
    defaultColumns: ["title", "size", "price", "building", "updatedAt"],
    preview: (doc, { locale }) => {
      if (doc?.slug) {
        return `/${locale}/apartments/${doc.slug}?preview=${process.env.PREVIEW_SECRET}`;
      }
      return null;
    },
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    ...slugField(),
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      localized: true,
    },
    {
      name: "description",
      type: "richText",
      localized: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => {
          return [
            ...defaultFeatures,
            HeadingFeature({
              enabledHeadingSizes: ["h2", "h3"],
            }),
            BlocksFeature({
              blocks: [mediaBlock, videoEmbedBlock, quoteBlock],
            }),
          ];
        },
      }),
    },
    {
      name: "building",
      type: "relationship",
      relationTo: ["buildings"],
      required: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "size",
      type: "number",
      admin: {
        description: "Size in square meters",
      },
    },
    {
      name: "rooms",
      type: "number",
    },
    {
      name: "floor",
      type: "number",
    },
    {
      name: "price",
      type: "number",
    },
    {
      name: "features",
      type: "array",
      localized: true,
      fields: [
        {
          name: "feature",
          type: "text",
        },
      ],
    },
    {
      name: "status",
      type: "select",
      options: [
        {
          label: "Available",
          value: "available",
        },
        {
          label: "Reserved",
          value: "reserved",
        },
        {
          label: "Sold",
          value: "sold",
        },
      ],
      defaultValue: "available",
      required: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "categories",
      type: "relationship",
      relationTo: ["categories"],
      hasMany: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "collection",
      type: "text",
      defaultValue: "apartments",
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
  ],
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [indexToElasticHook, revalidateApartmentHook],
    afterDelete: [removeFromElasticHook],
  },
};
