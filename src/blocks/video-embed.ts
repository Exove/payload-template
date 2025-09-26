import { Block } from "payload";

export const videoEmbedBlock: Block = {
  slug: "videoEmbed",
  fields: [
    {
      name: "youtubeId",
      type: "text",
      required: true,
    },
    {
      name: "alt",
      type: "text",
    },
    {
      name: "caption",
      type: "textarea",
    },
  ],
  interfaceName: "VideoEmbedBlock",
};
