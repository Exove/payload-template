// storage-adapter-import-placeholder
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { nestedDocsPlugin } from "@payloadcms/plugin-nested-docs";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { Apartments } from "./collections/apartments";
import { Articles } from "./collections/articles";
import { Buildings } from "./collections/buildings";
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
  },
  collections: [
    Users,
    Media,
    Articles,
    CollectionPage,
    News,
    Categories,
    Contacts,
    Buildings,
    Apartments,
  ],
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
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "",
      authToken: process.env.DATABASE_AUTH_TOKEN || "",
    },
    push: process.env.ENABLE_DATABASE_PUSH === "false" ? false : true,
  }),
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
