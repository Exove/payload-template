import { defaultContentFields } from "@/fields/default-content-fields";
import { CollectionConfig } from "payload";

export const Events: CollectionConfig = {
  slug: "events",
  admin: {
    useAsTitle: "title",
    group: "Pages",
    defaultColumns: ["title", "createdBy", "updatedAt", "createdAt"],
  },
  fields: [
    ...defaultContentFields,
    {
      name: "startDate",
      type: "date",
      required: true,
      admin: {
        position: "sidebar",
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "endDate",
      type: "date",
      admin: {
        position: "sidebar",
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "location",
      type: "text",
      localized: true,
    },
    {
      name: "registrationUrl",
      type: "text",
      localized: false,
      admin: {
        description: "If the event has a registration page, enter the URL here.",
      },
    },
    {
      name: "collection",
      type: "text",
      defaultValue: "events",
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
  ],
};
