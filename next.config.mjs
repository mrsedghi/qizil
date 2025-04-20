// next.config.mjs
import withPWA from "@ducanh2912/next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // Required for Liara deployment
  images: {
    domains: ["htvevwvovxmbvffxccmj.supabase.co"],
  },
};

export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
})(nextConfig);
