import { PostHog } from "posthog-node";

let posthogSingleton: PostHog | null = null;

function getServerPostHog(): PostHog | null {
  if (posthogSingleton) return posthogSingleton;

  const apiKey =
    process.env.POSTHOG_KEY || process.env.POSTHOG_API_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host =
    process.env.POSTHOG_HOST || process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

  if (!apiKey) return null;

  posthogSingleton = new PostHog(apiKey, {
    host,
    flushAt: 1,
    flushInterval: 0,
  });

  return posthogSingleton;
}

export function captureServerException(error: unknown, properties?: Record<string, unknown>): void {
  const ph = getServerPostHog();
  if (!ph) return;

  const err =
    error instanceof Error ? error : new Error(typeof error === "string" ? error : "Unknown error");

  ph.capture({
    distinctId: "server",
    event: "$exception",
    properties: {
      // Properties recognized by PostHog Error tracking
      $exception_message: err.message,
      $exception_type: err.name,
      $exception_level: "error",
      $exception_fingerprint: `${err.name}:${err.message}`,
      // // Minimal list entry to satisfy Error tracking schema
      // // TODO: remove if it works without it
      // $exception_list: [
      //   {
      //     type: err.name,
      //     value: err.message,
      //     stacktrace: { frames: [] },
      //   },
      // ],
      ...properties,
    },
  });
}
