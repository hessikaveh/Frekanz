function getBaseUrl() {
  return process.env.VERCEL_ENV === "production"
    ? `frekanz.vercel.app`
    : process.env.NEXT_PUBLIC_VERCEL_URL
    ? `${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : `localhost:3000`;
}
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SITE_URL: getBaseUrl(),
  },
};

module.exports = nextConfig;
