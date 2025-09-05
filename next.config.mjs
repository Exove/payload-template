import { withPayload } from "@payloadcms/next/withPayload";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  compress: true,
  images: { unoptimized: false },
};

export default withNextIntl(withPayload(nextConfig));
