import { defineConfig } from "@c15t/backend/v2";
import { kyselyAdapter } from "@c15t/backend/v2/db/adapters/kysely";
import type { ConsentManagerOptions } from "@c15t/nextjs";
import Database from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";

export type C15TClientOptions = Omit<ConsentManagerOptions, "callbacks">;

const database = new Database("./c15t.sqlite");
database.pragma("foreign_keys = ON");

const db = new Kysely({
  dialect: new SqliteDialect({
    database,
  }),
});

export default defineConfig({
  adapter: kyselyAdapter({ provider: "sqlite", db }),
});

export const buildC15TClientOptions = (locale: string): C15TClientOptions => {
  return {
    mode: "c15t",
    backendURL: "/api/c15t",
    consentCategories: ["necessary", "measurement"],
    ignoreGeoLocation: true,
    react: {
      colorScheme: "dark",
    },
    translations: {
      defaultLanguage: locale,
      translations: {
        en: {
          common: {
            acceptAll: "Accept all",
            rejectAll: "Deny",
            customize: "Consent settings",
            save: "Save preferences",
          },
          cookieBanner: {
            title: "We value your privacy",
            description:
              "We use cookies to personalize content, remember your settings, and analyze traffic.",
          },
          consentManagerDialog: {
            title: "Privacy settings",
            description: "Choose which cookies we can use. You can change your choices anytime.",
          },
          consentTypes: {
            necessary: {
              title: "Necessary",
              description: "Required for core site functionality and cannot be disabled.",
            },
            marketing: {
              title: "Marketing",
              description: "Show relevant ads and measure their effectiveness.",
            },
            measurement: {
              title: "Analytics",
              description: "Help us understand site usage to improve our services.",
            },
            functionality: {
              title: "Preferences",
              description: "Remember your settings to provide enhanced features.",
            },
            experience: {
              title: "Personalization",
              description: "Tailor content and features to your preferences.",
            },
          },
        },
        fi: {
          common: {
            acceptAll: "Hyväksy kaikki",
            rejectAll: "Hylkää",
            customize: "Valitse",
            save: "Tallenna valinnat",
          },
          cookieBanner: {
            title: "Arvostamme yksityisyyttäsi",
            description:
              "Tämä sivusto käyttää evästeitä parantaakseen selauskokemustasi ja analysoidakseen sivuston liikennettä.",
          },
          consentManagerDialog: {
            title: "Tietosuoja-asetukset",
            description: "Valitse, mitä evästetyyppejä voimme käyttää.",
          },
          consentTypes: {
            necessary: {
              title: "Välttämättömät",
              description: "Tarvitaan sivuston perustoimintoihin, eikä niitä voi poistaa käytöstä.",
            },
            marketing: {
              title: "Markkinointi",
              description: "Näyttää sinulle relevantteja mainoksia ja mittaa niiden tehoa.",
            },
            measurement: {
              title: "Analytiikka",
              description: "Auttaa ymmärtämään sivuston käyttöä ja kehittämään palvelua.",
            },
            functionality: {
              title: "Toiminnalliset asetukset",
              description: "Muistaa asetuksesi ja mahdollistaa laajennetut toiminnot.",
            },
            experience: {
              title: "Personointi ja käyttökokemus",
              description: "Räätälöi sisältöä ja toimintoja mieltymystesi mukaan.",
            },
          },
        },
      },
    },
  };
};
