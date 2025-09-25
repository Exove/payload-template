import {
  carouselBlock,
  contactsBlock,
  largeFeaturedPostBlock,
  linkListBlock,
  quoteBlock,
  smallFeaturedPostsWrapperBlock,
} from "@/blocks";
import { dynamicListBlock } from "@/blocks/dynamic-list";
import { heroFields } from "@/fields/hero-fields";
import { revalidatePath } from "next/cache";
import { GlobalAfterChangeHook, GlobalConfig } from "payload";

const revalidateFrontPageHook: GlobalAfterChangeHook = async () => {
  revalidatePath("/fi");
  revalidatePath("/en");
};

export const FrontPage: GlobalConfig = {
  slug: "front-page",
  access: {
    read: () => true,
  },
  admin: {
    group: "Pages",
    preview: (_doc, { locale }) => {
      return `/${locale}/preview?token=${process.env.PREVIEW_SECRET}`;
    },
  },
  fields: [
    {
      name: "hero",
      type: "array",
      localized: true,
      maxRows: 1,
      fields: heroFields,
    },
    {
      name: "content",
      type: "blocks",
      localized: true,
      blocks: [
        largeFeaturedPostBlock,
        smallFeaturedPostsWrapperBlock,
        carouselBlock,
        linkListBlock,
        contactsBlock,
        quoteBlock,
        dynamicListBlock,
      ],
    },
  ],
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [revalidateFrontPageHook],
  },
};
