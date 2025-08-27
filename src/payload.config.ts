// storage-adapter-import-placeholder
import { postgresAdapter } from "@payloadcms/db-postgres";
import { resendAdapter } from "@payloadcms/email-resend";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
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
import { Events } from "./collections/events";
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
    components: {
      providers: ["@/components/admin-ui/RoleBodyClassProvider#RoleBodyClassProvider"],
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
  collections: [Users, Media, Articles, CollectionPage, News, Events, Categories, Contacts],
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
  jobs: {
    autoRun: [
      {
        cron: process.env.PAYLOAD_JOBS_CRON || "*/1 * * * *",
        limit: 100,
      },
    ],
    shouldAutoRun: async () => {
      return true;
    },
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
    push: true,
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
  ],
});
