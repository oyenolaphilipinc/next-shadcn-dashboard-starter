/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "api.slingacademy.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // ✅ Add Cloudinary
      },
    ],
  },
  transpilePackages: ["geist"],
};

module.exports = nextConfig;
