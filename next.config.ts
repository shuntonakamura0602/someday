import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/life",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
