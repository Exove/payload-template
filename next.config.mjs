import { withPayload } from "@payloadcms/next/withPayload";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  images: { unoptimized: false },
  // Configuration to fix PayloadCMS React Server Components bundler errors
  experimental: {
    reactCompiler: false,
    ppr: false,
  },
  serverExternalPackages: [
    "@payloadcms/richtext-lexical",
    "@payloadcms/plugin-seo",
    "@payloadcms/ui",
  ],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
  // End of PayloadCMS React Server Components bundler errors configuration
};

export default withNextIntl(withPayload(nextConfig));
