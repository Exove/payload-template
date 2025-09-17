"use client";

import Container from "@/components/Container";
import Heading from "@/components/Heading";
import { useConsentManager } from "@c15t/nextjs";
import { getCookies } from "cookies-next/client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type CookieInfo = {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  expires?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: string;
  category: string;
  purpose: string;
  provider: string;
};

type CookieCategory = "necessary" | "measurement" | "marketing" | "functionality";

const getCookieDefinitions = (): Record<string, Omit<CookieInfo, "name" | "value">> => {
  const hostname = typeof window !== "undefined" ? window.location?.hostname : "";

  return {
    // C15T Consent Manager cookies
    "c15t-consent": {
      category: "necessary",
      purpose: "Stores user's cookie consent preferences",
      provider: "C15T",
      domain: hostname,
      path: "/",
      secure: true,
      sameSite: "Lax",
    },
    "c15t-session": {
      category: "necessary",
      purpose: "Manages consent session state",
      provider: "C15T",
      domain: hostname,
      path: "/",
      secure: true,
      sameSite: "Lax",
    },
    c15t_test_measurement: {
      category: "measurement",
      purpose: "Test cookie for analytics tracking consent",
      provider: "C15T",
      domain: hostname,
      path: "/",
      secure: false,
      sameSite: "Lax",
    },
    // Next.js cookies
    __vercel_live_token: {
      category: "necessary",
      purpose: "Vercel deployment preview authentication",
      provider: "Vercel",
      secure: true,
      sameSite: "None",
    },
    __vercel_toolbar: {
      category: "necessary",
      purpose: "Vercel toolbar functionality",
      provider: "Vercel",
      secure: true,
      sameSite: "None",
    },
    // Next.js session cookies
    "next-auth.session-token": {
      category: "necessary",
      purpose: "User authentication session",
      provider: "NextAuth.js",
      secure: true,
      httpOnly: true,
      sameSite: "Lax",
    },
    "next-auth.csrf-token": {
      category: "necessary",
      purpose: "CSRF protection for authentication",
      provider: "NextAuth.js",
      secure: true,
      httpOnly: true,
      sameSite: "Lax",
    },
    // Language preferences
    NEXT_LOCALE: {
      category: "functionality",
      purpose: "Stores user's language preference",
      provider: "Next-intl",
      path: "/",
      sameSite: "Lax",
    },
    // PostHog analytics cookies
    "ph_*": {
      category: "measurement",
      purpose: "PostHog analytics - user identification and session tracking",
      provider: "PostHog",
      domain: hostname ? `.${hostname}` : "",
      expires: "1 year",
      secure: true,
      sameSite: "Lax",
    },
    "__ph_opt_in_out_*": {
      category: "measurement",
      purpose: "PostHog analytics - stores user's opt-in/opt-out preferences",
      provider: "PostHog",
      domain: hostname ? `.${hostname}` : "",
      expires: "1 year",
      secure: true,
      sameSite: "Lax",
    },
    "ph_phc_*": {
      category: "measurement",
      purpose: "PostHog analytics - captures user events and properties",
      provider: "PostHog",
      domain: hostname ? `.${hostname}` : "",
      expires: "1 year",
      secure: true,
      sameSite: "Lax",
    },
    "posthog_*": {
      category: "measurement",
      purpose: "PostHog analytics - legacy cookie format for user tracking",
      provider: "PostHog",
      domain: hostname ? `.${hostname}` : "",
      expires: "1 year",
      secure: true,
      sameSite: "Lax",
    },
    // PostHog feature flags
    "$feature_flag_*": {
      category: "functionality",
      purpose: "PostHog feature flags - controls feature visibility and A/B testing",
      provider: "PostHog",
      domain: hostname ? `.${hostname}` : "",
      expires: "Session",
      secure: true,
      sameSite: "Lax",
    },
    // PostHog session recording
    "__ph_session_*": {
      category: "measurement",
      purpose: "PostHog session recording - tracks user sessions for replay analysis",
      provider: "PostHog",
      domain: hostname ? `.${hostname}` : "",
      expires: "30 minutes",
      secure: true,
      sameSite: "Lax",
    },
    // PostHog surveys
    "posthog_survey_*": {
      category: "functionality",
      purpose: "PostHog surveys - manages survey display and responses",
      provider: "PostHog",
      domain: hostname ? `.${hostname}` : "",
      expires: "1 year",
      secure: true,
      sameSite: "Lax",
    },
  };
};

export default function CookiesPage() {
  const t = useTranslations("cookies");
  const [cookies, setCookies] = useState<CookieInfo[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isClient, setIsClient] = useState(false);
  const { has } = useConsentManager();

  const refreshCookies = () => {
    const allCookies = getCookies();
    const cookieList: CookieInfo[] = [];
    const cookieDefinitions = getCookieDefinitions();

    Object.entries(allCookies || {}).forEach(([name, value]) => {
      const definition =
        cookieDefinitions[name] ||
        // Handle wildcard matches like _ga_*, ph_*, $feature_flag_*
        Object.entries(cookieDefinitions).find(([pattern]) => {
          if (pattern.includes("*")) {
            const prefix = pattern.replace("*", "");
            return name.startsWith(prefix);
          }
          return false;
        })?.[1];

      const cookieInfo: CookieInfo = {
        name,
        value: String(value),
        category: definition?.category || "necessary",
        purpose: definition?.purpose || "Unknown purpose",
        provider: definition?.provider || "This website",
        domain: definition?.domain,
        path: definition?.path,
        expires: definition?.expires,
        secure: definition?.secure,
        httpOnly: definition?.httpOnly,
        sameSite: definition?.sameSite,
      };

      cookieList.push(cookieInfo);
    });

    setCookies(cookieList);
    setLastUpdated(new Date());
  };

  useEffect(() => {
    setIsClient(true);
    refreshCookies();
  }, []);

  const groupedCookies = cookies.reduce(
    (acc, cookie) => {
      const category = cookie.category as CookieCategory;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(cookie);
      return acc;
    },
    {} as Record<CookieCategory, CookieInfo[]>,
  );

  const categories: CookieCategory[] = ["necessary", "measurement", "marketing", "functionality"];

  const formatExpiry = (expires?: string) => {
    if (!expires) return t("cookieDetails.session");
    return expires;
  };

  const formatBoolean = (value?: boolean) => {
    if (value === undefined) return t("cookieDetails.notSet");
    return value ? t("cookieDetails.yes") : t("cookieDetails.no");
  };

  return (
    <Container className="py-12">
      <div className="mx-auto max-w-4xl">
        <Heading level="h1" className="mb-6">
          {t("title")}
        </Heading>

        <p className="mb-8 text-lg text-stone-300">{t("description")}</p>

        {/* Cookie Consent Status */}
        <div className="mb-8 rounded-lg bg-stone-800 p-6">
          <Heading level="h2" className="mb-4">
            {t("cookieConsent.title")}
          </Heading>
          <p className="mb-4 text-stone-300">{t("cookieConsent.description")}</p>
          <div className="mb-4 flex flex-wrap gap-4">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <span className="text-sm font-medium">{t(`categories.${category}.title`)}:</span>
                {isClient ? (
                  <span className={`text-sm ${has(category) ? "text-green-400" : "text-red-400"}`}>
                    {has(category) ? t("cookieDetails.yes") : t("cookieDetails.no")}
                  </span>
                ) : (
                  <span className="text-sm text-stone-400">Loading...</span>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              // Trigger consent manager dialog by dispatching event
              const event = new CustomEvent("c15t:open-dialog");
              window.dispatchEvent(event);
            }}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            {t("cookieConsent.changeSettings")}
          </button>
        </div>

        {/* Refresh Button */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-stone-400">
            {t("lastUpdated", { date: lastUpdated.toLocaleString() })}
          </p>
          <button
            onClick={refreshCookies}
            className="rounded-lg bg-stone-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-600"
          >
            {t("refreshCookies")}
          </button>
        </div>

        {/* Cookie Categories */}
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category} className="rounded-lg bg-stone-800 p-6">
              <Heading level="h2" className="mb-4">
                {t(`categories.${category}.title`)}
              </Heading>
              <p className="mb-6 text-stone-300">{t(`categories.${category}.description`)}</p>

              {groupedCookies[category]?.length > 0 ? (
                <div className="space-y-4">
                  {groupedCookies[category].map((cookie, index) => (
                    <div key={`${cookie.name}-${index}`} className="rounded-lg bg-stone-900 p-4">
                      <div className="mb-3 flex items-start justify-between">
                        <h3 className="font-mono text-lg font-semibold text-white">
                          {cookie.name}
                        </h3>
                        <span className="rounded bg-stone-700 px-2 py-1 text-xs text-stone-300">
                          {cookie.provider}
                        </span>
                      </div>

                      <p className="mb-4 text-stone-300">{cookie.purpose}</p>

                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <span className="text-sm font-medium text-stone-400">
                            {t("cookieDetails.value")}:
                          </span>
                          <p className="break-all font-mono text-sm text-stone-200">
                            {cookie.value.length > 50
                              ? `${cookie.value.substring(0, 50)}...`
                              : cookie.value}
                          </p>
                        </div>

                        {cookie.domain && (
                          <div>
                            <span className="text-sm font-medium text-stone-400">
                              {t("cookieDetails.domain")}:
                            </span>
                            <p className="font-mono text-sm text-stone-200">{cookie.domain}</p>
                          </div>
                        )}

                        {cookie.path && (
                          <div>
                            <span className="text-sm font-medium text-stone-400">
                              {t("cookieDetails.path")}:
                            </span>
                            <p className="font-mono text-sm text-stone-200">{cookie.path}</p>
                          </div>
                        )}

                        <div>
                          <span className="text-sm font-medium text-stone-400">
                            {t("cookieDetails.expires")}:
                          </span>
                          <p className="text-sm text-stone-200">{formatExpiry(cookie.expires)}</p>
                        </div>

                        <div>
                          <span className="text-sm font-medium text-stone-400">
                            {t("cookieDetails.secure")}:
                          </span>
                          <p className="text-sm text-stone-200">{formatBoolean(cookie.secure)}</p>
                        </div>

                        <div>
                          <span className="text-sm font-medium text-stone-400">
                            {t("cookieDetails.httpOnly")}:
                          </span>
                          <p className="text-sm text-stone-200">{formatBoolean(cookie.httpOnly)}</p>
                        </div>

                        {cookie.sameSite && (
                          <div>
                            <span className="text-sm font-medium text-stone-400">
                              {t("cookieDetails.sameSite")}:
                            </span>
                            <p className="text-sm text-stone-200">{cookie.sameSite}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-stone-400">{t("noCookies")}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
