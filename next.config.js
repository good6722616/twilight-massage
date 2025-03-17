/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/booking",
        destination:
          "https://book.squareup.com/appointments/xe96ggmxltf5b6/location/L3RH0J52JYVYX/services",
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
