// storage-adapter-import-placeholder
import { postgresAdapter } from "@payloadcms/db-postgres";
import { resendAdapter } from "@payloadcms/email-resend";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { formBuilderPlugin } from "@payloadcms/plugin-form-builder";
import { nestedDocsPlugin } from "@payloadcms/plugin-nested-docs";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { Articles } from "./collections/articles";
import { Categories } from "./collections/categories";
import { CollectionPage } from "./collections/collection-page";
import { Contacts } from "./collections/contacts";
import { Media } from "./collections/media";
import { News } from "./collections/news";
import { Users } from "./collections/users";
import { seoConfig } from "./fields/seo";
import { Footer } from "./globals/Footer";
import { FooterMenu } from "./globals/FooterMenu";
import { FrontPage } from "./globals/FrontPage";
import { MainMenu } from "./globals/MainMenu";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    theme: "light",
    dateFormat: "dd.MM.yyyy",
    timezones: {
      defaultTimezone: "Europe/Helsinki",
      supportedTimezones: [{ label: "Helsinki (EET/EEST)", value: "Europe/Helsinki" }],
    },
  },
  email: resendAdapter({
    apiKey: process.env.RESEND_API_KEY || "",
    defaultFromAddress: process.env.RESEND_FROM_ADDRESS || "no-reply@example.com",
    defaultFromName: process.env.RESEND_FROM_NAME || "Demo app",
  }),
  collections: [Users, Media, Articles, CollectionPage, News, Categories, Contacts],
  globals: [FrontPage, MainMenu, FooterMenu, Footer],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [...defaultFeatures],
  }),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  localization: {
    locales: ["fi", "en"],
    defaultLocale: "fi",
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  graphQL: {
    disable: true,
  },
  sharp,
  plugins: [
    payloadCloudPlugin(),
    seoConfig,
    nestedDocsPlugin({
      collections: ["categories"],
      generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ""),
    }),
    formBuilderPlugin({
      fields: {
        payment: false,
        state: false,
        country: false,
        date: true,
        radio: true,
      },
      redirectRelationships: ["articles", "news", "collection-pages"],
      formOverrides: {
        admin: { group: "Forms" },
      },
      formSubmissionOverrides: {
        admin: { group: "Forms" },
        fields: ({ defaultFields }) => {
          const fields = [...defaultFields];
          // Hide all default fields in admin UI
          fields.forEach((f) => {
            if (typeof f === "object" && f && "admin" in f) {
              const withAdmin = f as { name?: string; admin?: { hidden?: boolean } };
              // Keep the form name visible
              if (withAdmin.name === "form" || withAdmin.name === "name") return;
              withAdmin.admin = { ...withAdmin.admin, hidden: true };
            }
          });
          // Add our UI viewer as the only visible field
          const viewerField = {
            name: "submissionViewer",
            type: "ui",
            admin: {
              components: {
                Field: "@/components/admin-ui/FormSubmissionViewer#FormSubmissionViewer",
              },
              description: "Readable view of submitted values",
            },
          } as unknown as (typeof defaultFields)[number];
          fields.push(viewerField);
          return fields;
        },
      },
    }),
  ],
});
