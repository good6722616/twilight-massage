/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://twilightmassage.com",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    additionalSitemaps: ["https://twilightmassage.com/server-sitemap.xml"],
  },
  exclude: ["/server-sitemap.xml"],
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 7000,
}
