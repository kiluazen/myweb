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
        source: "/nexus/terms-of-service",
        destination: "https://nexus.kushalsm.com/terms-of-service/",
        permanent: true,
      },
      {
        source: "/nexus/privacy-policy",
        destination: "https://nexus.kushalsm.com/privacy-policy/",
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
