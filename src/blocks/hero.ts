import { linkFieldWithLabel } from "@/fields/link";
import { Block } from "payload";

export const heroBlock: Block = {
  slug: "hero",
  labels: {
    singular: "Hero",
    plural: "Heroes",
  },
  fields: [
    {
      name: "blockType",
      type: "text",
      required: true,
      defaultValue: "hero",
      admin: {
        hidden: true,
      },
    },
    {
      name: "title",
      type: "text",
      required: true,
      label: "Title",
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      label: "Description",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Image",
    },
    {
      name: "link",
      type: "group",
      fields: [...linkFieldWithLabel],
    },
  ],
  interfaceName: "HeroBlock",
};
