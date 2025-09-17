import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default intlMiddleware;

export const config = {
  matcher: [
    // i18n routes
    "/",
    "/(fi|en)/:path*",
    // Match all non-locale paths (excluding api/admin/Next internals/static files)
    "/((?!api|admin|_next|_vercel|.*\\..*).*)",
  ],
};
