import { HeroHeader, ContentSection } from "@/types/contents"

/* ====================
[> CUSTOMIZING CONTENT <]
-- Setup image by typing `/image-name.file` (Example: `/header-image.jpg`)
-- Add images by adding files to /public folder
-- Leave blank `` if you don't want to put texts or images
 ==================== */

export const heroHeader: HeroHeader = {
  header: `Twilight Massage&SPA`,
  subheader: `Your sanctuary for relaxation and renewal.`,
  image: ``, // {{ edit_1 }} Add the required image property
}

export const featureCards: ContentSection = {
  header: `Discover Our Treatments`,
  subheader: `Always Better than Seven Falls`,
  content: [
    {
      text: `Swedish Massage`,
      subtext: `A classic massage designed to relax the entire body, improve circulation, and relieve muscle tension.`,
      icon: "nextjs",
      price: `Price: $100 for 60 minutes`,
      image: `/swedish_massage.png`,
    },
    {
      text: `Deep Tissue Massage`,
      subtext: `A focused, therapeutic massage to relieve muscle tension, reduce pain, and improve mobility`,
      icon: "shadcnUi",
      price: `Price: $100 for 60 minutes`,
      image: `/deep-tissue-massage.png`,
    },
    {
      text: `Foot Massage`,
      subtext: `Targeted pressure point massage to relieve tension and stress in the feet, promoting full-body relaxation.`,
      icon: "vercel",
      price: `Price: $100 for 60 minutes`,
      image: `/foot_massage.png`,
    },
  ],
}

export const features: ContentSection = {
  header: ``,
  subheader: ``,
  image: ``,
  content: [
    {
      text: `Swedish Massage`,
      subtext: `The massage combination includes 60 minutes of Swedish full-body massage`,
      price: `Price: $100 for 60 minutes`,
      icon: "fileSearch",
    },
    // {
    //   text: `Highly Performant`,
    //   subtext: `Fast loading times and smooth performance`,
    //   icon: "barChart",
    // },
    // {
    //   text: `Easy Customizability`,
    //   subtext: `Change your content and layout with little effort`,
    //   icon: "settings",
    // },
  ],
}
