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
  // webpack: (config, { isServer }) => {
  //   // Ignore the critical dependency warning for Supabase realtime
  //   config.ignoreWarnings = [
  //     ...(config.ignoreWarnings || []),
  //     {
  //       module: /node_modules\/@supabase\/realtime-js/,
  //       message:
  //         /Critical dependency: the request of a dependency is an expression/,
  //     },
  //   ]

  //   return config
  // },
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
