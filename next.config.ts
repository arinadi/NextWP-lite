import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  // Serwist only generates the service worker during `next build`.
  // During `next dev`, it shows a Turbopack warning but does not interfere.
});

const nextConfig: NextConfig = {
  turbopack: {},
};

export default withSerwist(nextConfig);
