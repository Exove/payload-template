import { HeadingFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { Field } from "payload";

export const richTextFields: Field[] = [
  {
    name: "content",
    type: "richText",
    required: true,
    editor: lexicalEditor({
      features: ({ defaultFeatures }) => [
        ...defaultFeatures.filter(
          (feature) => feature.key !== "checklist" && feature.key !== "relationship",
        ),
        HeadingFeature({
          enabledHeadingSizes: ["h2", "h3"],
        }),
      ],
    }),
  },
];
