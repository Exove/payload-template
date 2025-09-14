"use client";

import { useEffect } from "react";

export default function NotFoundErrorCapture() {
  useEffect(() => {
    // Get current URL
    const currentUrl = window.location.href;

    // Import PostHog and capture exception
    import("posthog-js")
      .then(({ default: posthog }) => {
        if (posthog.__loaded) {
          posthog.captureException(new Error("404 Page Not Found"), {
            url: currentUrl,
            errorType: "404",
            source: "NotFoundPage",
          });
        }
      })
      .catch((error) => {
        console.error("Failed to load PostHog for error capture:", error);
      });
  }, []);

  return null;
}
