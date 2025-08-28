import { clerkMiddleware } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default clerkMiddleware((auth, req) => {
  return intlMiddleware(req);
});

export const config = {
  matcher: ["/", "/(fi|en)/:path*"],
};
