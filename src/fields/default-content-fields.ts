import {
  accordionBlock,
  contactsBlock,
  largeFeaturedPostBlock,
  linkListBlock,
  smallFeaturedPostsWrapperBlock,
  tabsBlock,
  videoEmbedBlock,
} from "@/blocks";
import { BlocksFeature, HeadingFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { Field } from "payload";
import { slugField } from "./slug";

export const defaultContentFields: Field[] = [
  {
    name: "title",
    type: "text",
    required: true,
    localized: true,
  },
  {
    name: "image",
    type: "upload",
    relationTo: "media",
    localized: true,
  },
  {
    name: "content",
    type: "richText",
    localized: true,
    editor: lexicalEditor({
      features: ({ defaultFeatures }) => {
        return [
          ...defaultFeatures.filter(
            (feature) => feature.key !== "checklist" && feature.key !== "relationship",
          ),
          HeadingFeature({
            enabledHeadingSizes: ["h2", "h3"],
          }),
          BlocksFeature({
            blocks: [
              accordionBlock,
              tabsBlock,
              largeFeaturedPostBlock,
              smallFeaturedPostsWrapperBlock,
              linkListBlock,
              contactsBlock,
              videoEmbedBlock,
            ],
          }),
        ];
      },
    }),
  },
  ...slugField(),
  {
    name: "createdBy",
    type: "relationship",
    relationTo: "users",
    admin: {
      position: "sidebar",
      readOnly: true,
      hidden: true,
    },
    hooks: {
      beforeChange: [
        ({ req, operation, value }) => {
          if (!value && operation === "create" && req.user) {
            return req.user.id;
          }
          return value;
        },
      ],
    },
  },
  {
    name: "sticky",
    type: "checkbox",
    admin: {
      position: "sidebar",
      description: "If checked, the post is displayed at the top of lists",
    },
  },
];
