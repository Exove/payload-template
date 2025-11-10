// storage-adapter-import-placeholder
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { multiTenantPlugin } from "@payloadcms/plugin-multi-tenant";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { Articles } from "@/collections/articles";
import { Categories } from "@/collections/categories";
import { Contacts } from "@/collections/contacts";
import { Media } from "@/collections/media";
import { Products } from "@/collections/products";
import { Tenants } from "@/collections/tenants";
import { Users } from "@/collections/users";
import { seoConfig } from "@/fields/seo-field";
import { Footer } from "@/globals/Footer";
import { FooterMenu } from "@/globals/FooterMenu";
import { FrontPage } from "@/globals/FrontPage";
import { MainMenu } from "@/globals/MainMenu";

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
  collections: [Tenants, Users, Media, Products, Articles, Categories, Contacts],
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
      url: process.env.DATABASE_URI || "file:./payload.db",
    },
  }),
  graphQL: {
    disable: true,
  },
  sharp,
  plugins: [
    multiTenantPlugin({
      tenantsSlug: Tenants.slug,
      tenantField: {
        admin: {
          disableListColumn: false,
          disableListFilter: false,
          position: "sidebar",
        },
      },
      tenantsArrayField: {
        includeDefaultField: false,
        arrayFieldName: "tenants",
        arrayTenantFieldName: "tenant",
      },
      userHasAccessToAllTenants: (user) => user?.role === "admin",
      collections: {
        [Articles.slug]: {
          tenantFieldOverrides: {
            label: "Owning branch",
            admin: {
              description: "Articles are visible only to members of the selected branch.",
            },
          },
        },
        [Products.slug]: {
          tenantFieldOverrides: {
            label: "Owning branch",
            admin: {
              description: "Products stay isolated inside their assigned branch storefront.",
            },
          },
        },
        [Categories.slug]: {
          tenantFieldOverrides: {
            label: "Branch visibility",
            admin: {
              description: "Categories are scoped by branch for filtering and navigation.",
            },
          },
        },
        [Contacts.slug]: {
          tenantFieldOverrides: {
            label: "Owning branch",
            admin: {
              description: "Contacts remain private to the assigned branch.",
            },
          },
        },
      },
    }),
    payloadCloudPlugin(),
    seoConfig,
  ],
});
