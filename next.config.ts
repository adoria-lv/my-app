import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'adoria.s3.eu-north-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
