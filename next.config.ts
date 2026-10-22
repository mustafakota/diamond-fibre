import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      {
        source: '/:locale/products/gaddas',
        destination: '/:locale/products/mattresses',
        permanent: true,
      },
      {
        source: '/products/gaddas',
        destination: '/en/products/mattresses',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
