import { mediaBlock, quoteBlock, videoEmbedBlock } from "@/blocks";
import { slugField } from "@/fields/slug";
import { BlocksFeature, HeadingFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { revalidatePath } from "next/cache";
import { CollectionAfterChangeHook, CollectionConfig } from "payload";
import { indexToElasticHook, removeFromElasticHook } from "./hooks/indexToElastic";

const revalidateBuildingHook: CollectionAfterChangeHook = async ({ doc, operation }) => {
  if (operation === "create" || operation === "update" || operation === "delete") {
    revalidatePath(`/fi/buildings/${doc.slug}`);
    revalidatePath(`/en/buildings/${doc.slug}`);
  }
};

export const Buildings: CollectionConfig = {
  slug: "buildings",
  admin: {
    useAsTitle: "title",
    group: "Pages",
    defaultColumns: ["title", "address", "buildYear", "updatedAt"],
    preview: (doc, { locale }) => {
      if (doc?.slug) {
        return `/${locale}/buildings/${doc.slug}?preview=${process.env.PREVIEW_SECRET}`;
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
      name: "address",
      type: "group",
      fields: [
        {
          name: "street",
          type: "text",
          localized: true,
        },
        {
          name: "postalCode",
          type: "text",
        },
        {
          name: "city",
          type: "text",
          localized: true,
        },
      ],
    },
    {
      name: "buildYear",
      type: "number",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "renovationYear",
      type: "number",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "categories",
      type: "relationship",
      relationTo: "categories",
      hasMany: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "collection",
      type: "text",
      defaultValue: "buildings",
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
    afterChange: [indexToElasticHook, revalidateBuildingHook],
    afterDelete: [removeFromElasticHook],
  },
};
