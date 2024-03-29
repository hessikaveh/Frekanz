/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL,
  },
};

module.exports = nextConfig;
