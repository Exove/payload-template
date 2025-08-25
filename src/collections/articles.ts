import { defaultContentFields } from "@/fields/default-content-fields";
import { CollectionAfterChangeHook, CollectionConfig } from "payload";

const notifyDraftEmailHook: CollectionAfterChangeHook = async ({ doc, req, operation }) => {
  try {
    if ((operation === "create" || operation === "update") && doc?._status === "draft") {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const adminRelativePath = `/admin/collections/articles/${doc.id}`;
      const adminUrl = `${siteUrl}${adminRelativePath}`;

      const editorName = req?.user?.email || "Unknown editor";
      const articleTitle = typeof doc?.title === "string" ? doc.title : "Untitled";

      await req.payload.sendEmail({
        from: `${process.env.RESEND_FROM_NAME || "Demo app"} <${
          process.env.RESEND_FROM_ADDRESS || "no-reply@torppadiy.com"
        }>`,
        to: `${process.env.RESEND_TO_ADDRESS || "matti.hernesniemi@exove.com"}`,
        subject: `Draft saved: ${articleTitle}`,
        html: `
          <p>A new draft has been saved.</p>
          <p><strong>Title:</strong> ${articleTitle}</p>
          <p><strong>Editor:</strong> ${editorName}</p>
          <p><a href="${adminUrl}">Open as editor</a></p>
        `,
      });
    }
  } catch (error) {
    const err = error as { name?: string; message?: string; status?: number; data?: unknown };
    req?.payload.logger.error({
      msg: "Failed to send draft notification email",
      name: err?.name,
      message: err?.message,
      status: err?.status,
      data: err?.data,
    });
  }
};

export const Articles: CollectionConfig = {
  slug: "articles",
  admin: {
    useAsTitle: "title",
    group: "Pages",
    defaultColumns: ["title", "createdBy", "updatedAt", "createdAt", "status"],
    preview: (doc, { locale }) => {
      if (doc?.slug) {
        return `/${locale}/articles/${doc.slug}?preview=${process.env.PREVIEW_SECRET}`;
      }
      return null;
    },
  },
  fields: [
    ...defaultContentFields,
    {
      name: "author",
      type: "relationship",
      relationTo: "contacts",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "categories",
      type: "relationship",
      relationTo: "categories",
      hasMany: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "publishedDate",
      type: "date",
      admin: {
        position: "sidebar",
        date: {
          pickerAppearance: "dayOnly",
        },
      },
    },
    {
      name: "collection",
      type: "text",
      defaultValue: "articles",
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
  ],
  versions: {
    drafts: {
      schedulePublish: true,
    },
  },
  hooks: {
    afterChange: [notifyDraftEmailHook],
  },
};
