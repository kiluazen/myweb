/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/portfolio",
        destination: "/products",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
