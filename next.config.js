/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/signin",
        permanent: false,
      },
      {
        source: "/dashboard/operations/attendance",
        destination: "/dashboard/update-attendance",
        permanent: false,
      },
      {
        source: "/dashboard/operations/attendance/:id",
        destination: "/dashboard/update-attendance/:id",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;