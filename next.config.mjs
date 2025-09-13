/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable experimental React Compiler to avoid requiring babel-plugin-react-compiler
  experimental: {},
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
