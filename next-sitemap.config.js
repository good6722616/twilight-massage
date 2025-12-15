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
        disallow: ["/admin/*"], // 禁止搜索引擎抓取 admin 路径
      },
    ],
    additionalSitemaps: ["https://twilightmassage.com/server-sitemap.xml"],
  },
  exclude: [
    "/server-sitemap.xml",
    "/admin/*", // 排除所有 admin 路径
  ],
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 7000,
}
