/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevents double mounting with Monaco in dev
  reactStrictMode: false,

  // Externalize better-sqlite3 for Node.js runtime
  experimental: {
    serverComponentsExternalPackages: ["better-sqlite3"],
  },
};

module.exports = nextConfig;
