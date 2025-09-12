import type { Locale } from "@/types/locales";
import type { ConsentManagerOptions } from "@c15t/nextjs";

export type C15TClientOptions = Omit<ConsentManagerOptions, "callbacks">;

export const buildC15TClientOptions = (locale: Locale): C15TClientOptions => {
  return {
    mode: "c15t",
    backendURL: "/api/c15t",
    consentCategories: ["necessary", "marketing"],
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
            rejectAll: "Reject all",
            customize: "Customize",
            save: "Save",
          },
          cookieBanner: {
            title: "Cookies",
            description: "We use cookies to improve your experience.",
          },
          consentManagerDialog: {
            title: "Privacy preferences",
            description: "Manage your cookie preferences.",
          },
          consentTypes: {
            necessary: {
              title: "Necessary",
              description: "Required for the site to function.",
            },
            marketing: {
              title: "Marketing",
              description: "Used to deliver personalized ads.",
            },
            measurement: {
              title: "Measurement",
              description: "Helps us understand site usage.",
            },
            functionality: {
              title: "Functionality",
              description: "Enables enhanced features.",
            },
            experience: {
              title: "Experience",
              description: "Improves user interactions.",
            },
          },
        },
        fi: {
          common: {
            acceptAll: "Hyväksy kaikki",
            rejectAll: "Hylkää kaikki",
            customize: "Muokkaa",
            save: "Tallenna",
          },
          cookieBanner: {
            title: "Evästeet",
            description: "Käytämme evästeitä parantaaksemme käyttökokemustasi.",
          },
          consentManagerDialog: {
            title: "Yksityisyysasetukset",
            description: "Hallitse evästeasetuksiasi.",
          },
          consentTypes: {
            necessary: {
              title: "Välttämätön",
              description: "Tarvitaan sivuston toimintaan.",
            },
            marketing: {
              title: "Markkinointi",
              description: "Käytetään personoitujen mainosten näyttämiseen.",
            },
            measurement: {
              title: "Mittaus",
              description: "Auttaa meitä ymmärtämään sivuston käyttöä.",
            },
            functionality: {
              title: "Toiminnallisuus",
              description: "Mahdollistaa parannetut ominaisuudet.",
            },
            experience: {
              title: "Käyttökokemus",
              description: "Parantaa käyttäjän vuorovaikutusta.",
            },
          },
        },
      },
    },
  };
};
