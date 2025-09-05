import {
  contactsBlock,
  ctaBlock,
  heroBlock,
  largeFeaturedPostBlock,
  linkListBlock,
  mediaBlock,
  quoteBlock,
  smallFeaturedPostsWrapperBlock,
  videoEmbedBlock,
} from "@/blocks";
import { dynamicListBlock } from "@/blocks/dynamic-list";
import { revalidatePath } from "next/cache";
import { GlobalAfterChangeHook, GlobalConfig } from "payload";

const revalidateFrontPageHook: GlobalAfterChangeHook = async () => {
  revalidatePath("/fi");
  revalidatePath("/en");
};

export const FrontPage: GlobalConfig = {
  slug: "front-page",
  access: {
    read: ({ req: { user } }) => !user || user?.role === "admin",
    update: ({ req: { user } }) => user?.role === "admin",
  },
  admin: {
    group: "Pages",
    preview: ({ locale }) => {
      return `/${locale}`;
    },
  },
  fields: [
    {
      name: "hero",
      type: "blocks",
      localized: true,
      maxRows: 1,
      blocks: [heroBlock],
    },
    {
      name: "featuredEvents",
      type: "array",
      localized: true,
      fields: [
        {
          name: "event",
          type: "relationship",
          relationTo: "events",
          hasMany: true,
          maxRows: 3,
          required: true,
        },
        {
          name: "backgroundImage",
          type: "upload",
          relationTo: "media",
        },
        {
          name: "title",
          type: "text",
        },
        {
          name: "description",
          type: "text",
        },
      ],
    },
    {
      name: "content",
      type: "blocks",
      localized: true,
      blocks: [
        ctaBlock,
        largeFeaturedPostBlock,
        smallFeaturedPostsWrapperBlock,
        linkListBlock,
        contactsBlock,
        videoEmbedBlock,
        mediaBlock,
        quoteBlock,
        dynamicListBlock,
      ],
    },
  ],
  versions: {
    drafts: {
      schedulePublish: true,
    },
  },
  hooks: {
    afterChange: [revalidateFrontPageHook],
  },
};
