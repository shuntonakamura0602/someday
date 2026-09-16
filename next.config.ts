import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/life", destination: "/", permanent: false },
      { source: "/ja/life", destination: "/ja", permanent: false },
      { source: "/en/life", destination: "/en", permanent: false },
    ];
  },
};

export default nextConfig;
