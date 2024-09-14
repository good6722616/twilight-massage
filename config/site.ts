import { SiteConfig, ContactConfig } from "@/types"

/* ====================
[> WEBSITE CONFIG <]
-- Fill the details about your website
 ==================== */

const baseUrl = "localhost:3000"

export const siteConfig: SiteConfig = {
  name: "Twilight SPA&Massage",
  author: "Charles Zhang",
  description:
    "Easy to setup, customizable, quick, and responsive landing page starter built with Next.js and shadcn/ui.",
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "Radix UI",
    "shadcn/ui",
    "Landing Page",
    "Template",
    "Starter",
  ],
  url: {
    base: baseUrl,
    author: "",
  },
  ogImage: `${baseUrl}/og.jpg`,
}

export const contactConfig: ContactConfig = {
  email: "shhwkk54@gmail.com",
}
