import { NextRequest, NextResponse } from "next/server";
import { PostHog } from "posthog-node";

// Initialize PostHog for server-side usage
const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
  enableExceptionAutocapture: true,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { errorMessage, errorType = "Error", context = {}, distinctId = "unknown-user" } = body;

    if (!errorMessage) {
      return NextResponse.json({ error: "errorMessage is required" }, { status: 400 });
    }

    // Create error object
    const error = new Error(errorMessage);
    error.name = errorType;

    // Capture the error to PostHog
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.captureException(error, {
        distinctId,
        userAgent: request.headers.get("user-agent"),
        timestamp: new Date().toISOString(),
        ...context, // Spread any additional context
      });

      // Ensure PostHog call is sent
      await posthog.flush();
    }

    return NextResponse.json(
      {
        success: true,
        message: "Error logged to PostHog successfully",
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to log error to PostHog:", error);

    return NextResponse.json(
      {
        error: "Failed to log error",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
