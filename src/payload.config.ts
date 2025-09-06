// storage-adapter-import-placeholder
import { postgresAdapter } from "@payloadcms/db-postgres";
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
        date: true,
        country: false,
      },
      redirectRelationships: ["articles", "news", "collection-pages"],
      formOverrides: {
        admin: { group: "Forms" },
      },
      formSubmissionOverrides: {
        admin: { group: "Forms" },
      },
    }),
  ],
});
