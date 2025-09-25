import { linkFieldWithLabel } from "@/fields/link-field";
import { Field } from "payload";

export const heroFields: Field[] = [
  {
    name: "title",
    type: "text",
    required: true,
    label: "Title",
  },
  {
    name: "description",
    type: "textarea",
    label: "Description",
  },
  {
    name: "image",
    type: "upload",
    relationTo: "media",
    required: true,
    label: "Image",
  },
  {
    name: "link",
    type: "group",
    fields: [...linkFieldWithLabel],
  },
];
