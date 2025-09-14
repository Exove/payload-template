type LogErrorOptions = {
  errorMessage: string;
  errorType?: string;
  distinctId?: string;
  context?: Record<string, unknown>;
};

/**
 * Log error to PostHog via API endpoint
 * This utility function provides a clean interface for logging errors to PostHog
 */
export async function logErrorToPostHog({
  errorMessage,
  errorType = "Error",
  distinctId = "unknown-user",
  context = {},
}: LogErrorOptions): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_ROOT_URL}/api/log-error`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        errorMessage,
        errorType,
        distinctId,
        context,
      }),
    });

    if (response.ok) {
      console.log("Error logged to PostHog successfully:", errorMessage);
      return true;
    } else {
      console.error("Failed to log error to PostHog:", await response.text());
      return false;
    }
  } catch (error) {
    console.error("Failed to call log-error API:", error);
    return false;
  }
}

/**
 * Log 404 error for article page
 */
export async function logArticleNotFoundError(slug: string, locale: string): Promise<void> {
  await logErrorToPostHog({
    errorMessage: `article-404: ${slug} not found`,
    errorType: "NotFoundError",
    distinctId: `article-404-${slug}`,
    context: {
      route: "/[locale]/articles/[slug]",
      slug,
      locale,
      source: "ArticlePage",
    },
  });
}

/**
 * Log general article page error
 */
export async function logArticlePageError(
  error: Error,
  slug: string,
  locale: string,
): Promise<void> {
  await logErrorToPostHog({
    errorMessage: error.message,
    errorType: error.constructor.name,
    distinctId: `article-error-${slug}`,
    context: {
      route: "/[locale]/articles/[slug]",
      slug,
      locale,
      source: "ArticlePage",
      stack: error.stack,
    },
  });
}
