/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // Required for Liara deployment
  images: {
    domains: ["htvevwvovxmbvffxccmj.supabase.co"],
  },
};

export default nextConfig;
