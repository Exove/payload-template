import { linkField, linkFieldWithLabel } from "@/fields/link-field";
import { Block } from "payload";

export const largeFeaturedPostBlock: Block = {
  slug: "largeFeaturedPost",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "text",
      type: "textarea",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "link",
      type: "group",
      fields: [...linkFieldWithLabel],
    },
  ],
  interfaceName: "LargeFeaturedPostBlock",
};

export const smallFeaturedPostsWrapperBlock: Block = {
  slug: "smallFeaturedPostsWrapper",
  labels: {
    singular: "Small Featured Posts",
    plural: "Small Featured Posts",
  },
  fields: [
    {
      name: "posts",
      type: "array",
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "link",
          type: "group",
          fields: [...linkField],
        },
      ],
      required: true,
    },
  ],
  interfaceName: "SmallFeaturedPostsWrapperBlock",
};
