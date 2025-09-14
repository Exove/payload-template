"use client";

import { useConsentManager } from "@c15t/nextjs";
import { usePathname, useSearchParams } from "next/navigation";
import type { PostHog } from "posthog-js";
import { useEffect, useRef } from "react";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

type Props = { locale?: string };

function hasSessionRecording(api: PostHog | null): api is PostHog & {
  startSessionRecording: () => void;
  stopSessionRecording: () => void;
} {
  return !!api && "startSessionRecording" in api && "stopSessionRecording" in api;
}

export default function AnalyticsProvider({ locale }: Props) {
  const { has } = useConsentManager();
  const allowMeasurement = has("measurement");
  const initializedRef = useRef(false);
  const posthogRef = useRef<PostHog | null>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize/teardown PostHog when consent changes
  useEffect(() => {
    if (!allowMeasurement) {
      if (initializedRef.current) {
        if (hasSessionRecording(posthogRef.current)) {
          posthogRef.current.stopSessionRecording();
        }
        posthogRef.current?.reset?.(true);
        posthogRef.current = null;
        initializedRef.current = false;
      }
      return;
    }

    if (!POSTHOG_KEY) return;

    if (!initializedRef.current) {
      import("posthog-js").then(({ default: posthog }) => {
        posthogRef.current = posthog;
        posthog.init(POSTHOG_KEY, {
          api_host: POSTHOG_HOST,
          autocapture: true,
          capture_pageview: true,
          capture_pageleave: true,
          disable_session_recording: false,
          mask_all_text: true,
          mask_all_element_attributes: true,
          capture_heatmaps: true,
          capture_performance: true,
          capture_dead_clicks: true,
          capture_exceptions: true,
          debug: true,
          loaded: (ph: PostHog) => {
            ph.onFeatureFlags(() => {
              const srEnabled = ph.featureFlags.isFeatureEnabled?.("session-recording-enabled");
              if (srEnabled) {
                if (hasSessionRecording(ph)) ph.startSessionRecording();
              } else {
                if (hasSessionRecording(ph)) ph.stopSessionRecording();
              }

              const acEnabled = ph.featureFlags.isFeatureEnabled?.("autocapture-enabled");
              ph.set_config?.({ autocapture: !!acEnabled });
            });
          },
        });
        initializedRef.current = true;
      });
    }
  }, [allowMeasurement]);

  // Track pageviews on client-side navigations
  useEffect(() => {
    if (!initializedRef.current || !allowMeasurement) return;
    const query = searchParams?.toString();
    const url = `${pathname}${query ? `?${query}` : ""}`;
    posthogRef.current?.capture?.("$pageview", { $current_url: url, locale });
  }, [pathname, searchParams, allowMeasurement, locale]);

  return null;
}
