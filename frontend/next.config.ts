import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'standalone',
    images: {
        unoptimized: true,
    },
    distDir: 'build', // Указываем новую директорию сборки
};

export default nextConfig;