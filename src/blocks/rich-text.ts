import { HeadingFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { Block } from "payload";

export const richTextBlock: Block = {
  slug: "richText",
  fields: [
    {
      name: "content",
      type: "richText",
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures.filter(
            (feature) =>
              feature.key !== "heading" &&
              feature.key !== "checklist" &&
              feature.key !== "relationship",
          ),
          HeadingFeature({
            enabledHeadingSizes: ["h2", "h3"],
          }),
        ],
      }),
    },
  ],
  interfaceName: "RichTextBlock",
};
