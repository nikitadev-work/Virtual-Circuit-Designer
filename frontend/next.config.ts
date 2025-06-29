import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'standalone',
    images: {
        unoptimized: true,
    },
    distDir: 'build',
};

export default nextConfig;