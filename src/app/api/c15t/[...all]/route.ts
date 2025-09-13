import config from "@/lib/c15t-config";
import { c15tInstance } from "@c15t/backend/v2";
import type { NextRequest } from "next/server";

const handler = c15tInstance({
  ...config,
  appName: "c15t-self-host",
  basePath: "/api/c15t",
  trustedOrigins: ["localhost", "vercel.app"],
  // advanced: {
  //   disableGeoLocation: true,
  //   openapi: {
  //     enabled: true,
  //   },
  // },
  logger: {
    level: "error",
  },
});

const handleRequest = async (request: NextRequest) => handler.handler(request);

export { handleRequest as GET, handleRequest as OPTIONS, handleRequest as POST };
