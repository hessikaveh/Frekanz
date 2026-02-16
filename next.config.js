function getBaseUrl() {
  return process.env.VERCEL_ENV === "production"
    ? `frekanz.vercel.app`
    : process.env.NEXT_PUBLIC_VERCEL_URL
      ? `${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : `localhost:3000`;
}
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/u/********",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/a/********",
      },
    ],
  },
  env: {
    SITE_URL: getBaseUrl(),
    NEXTAUTH_URL: getBaseUrl(),
  },
};

module.exports = nextConfig;
