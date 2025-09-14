"use client";

import { useEffect } from "react";

interface ErrorCaptureProps {
  error: Error;
}

export default function ErrorCapture({ error }: ErrorCaptureProps) {
  useEffect(() => {
    // Get current URL
    const currentUrl = window.location.href;

    // Import PostHog and capture exception
    import("posthog-js")
      .then(({ default: posthog }) => {
        if (posthog.__loaded) {
          posthog.captureException(error, {
            url: currentUrl,
            errorType: "application_error",
            source: "ErrorTemplate",
            errorMessage: error.message,
            errorStack: error.stack,
          });
        }
      })
      .catch((captureError) => {
        console.error("Failed to load PostHog for error capture:", captureError);
      });
  }, [error]);

  return null;
}
