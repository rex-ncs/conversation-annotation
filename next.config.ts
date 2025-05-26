import type { NextConfig } from "next";

const isProd = process.env.ENVIRONMENT === "production";

const nextConfig: NextConfig = {
  assetPrefix: isProd ? "/annotate" : "",
  basePath: isProd ? "/annotate" : "",
};

export default nextConfig;
