import { SiteConfig, ContactConfig } from "@/types"

/* ====================
[> WEBSITE CONFIG <]
-- Fill the details about your website
 ==================== */

export const siteConfig: SiteConfig = {
  name: "Twilight Massage & Spa",
  author: "Twilight Massage & Spa",
  description:
    "Experience luxury massage and spa treatments in a serene environment. Professional massage therapists, therapeutic treatments, and relaxation services.",
  keywords: [
    "massage spa",
    "therapeutic massage",
    "relaxation massage",
    "deep tissue massage",
    "swedish massage",
    "spa treatments",
    "wellness center",
    "massage therapy",
    "body massage",
    "facial treatments",
    "massage services",
    "spa services",
    "wellness massage",
    "massage therapist",
    "spa treatments",
  ],
  url: {
    base: "https://twilightmassagespa.com",
    author: "https://twilightmassagespa.com",
    facebook: "https://facebook.com/twilightmassagespa",
    instagram: "https://instagram.com/twilightmassagespa",
    twitter: "https://twitter.com/twilightmassagespa",
  },
  ogImage: "https://twilightmassagespa.com/og.jpg",
}

export const contactConfig: ContactConfig = {
  email: "twilightmassagespa@gmail.com",
  phone: "(949) 697-3888",
  address: "23805 El Toro Rd, Lake Forest, CA 92630",
  businessHours: {
    weekday: "10:00 AM - 8:30 PM",
    weekend: "10:00 AM - 8:30 PM",
    days: "Monday - Sunday",
  },
}
