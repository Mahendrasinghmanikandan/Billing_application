/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    Atlas_URL: process.env.Atlas_URL,
    Base_URL: process.env.Base_URL,
    Token_KEY: process.env.Token_KEY,
    crypting_KEY: process.env.crypting_KEY,
  },
};

module.exports = nextConfig;
