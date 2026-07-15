/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/nexus",
        destination: "https://nexus.kushalsm.com",
        permanent: true,
      },
      {
        source: "/portfolio",
        destination: "/products",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
