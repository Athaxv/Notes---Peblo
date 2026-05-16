import type { NextConfig } from "next";

/** API proxy is handled at runtime by `app/api/[[...path]]/route.ts` (reads BACKEND_URL per request). */
const nextConfig: NextConfig = {};

export default nextConfig;
