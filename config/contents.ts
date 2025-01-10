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

// ... existing code ...

export const featureCards: ContentSection = {
  header: `Our Popular Treatments`,
  subheader: `Step into a world of relaxation and rejuvenation with our wide range of treatments.`,
  content: [
    {
      text: `Swedish Massage`,
      subtext: `A classic massage designed to relax the entire body, improve circulation, and relieve muscle tension.`,
      price: `Price: $79 for 60 minutes`,
      image: `/swedish_massage.png`,
      bookingLink:
        "https://book.squareup.com/appointments/xe96ggmxltf5b6/location/L3RH0J52JYVYX/services/JP63BPFNQM2J5VYNS7XXBCQZ",
    },
    {
      text: `Deep Tissue Massage`,
      subtext: `A focused, therapeutic massage to relieve muscle tension, reduce pain, and improve mobility`,
      price: `Price: $89 for 60 minutes`,
      image: `/deep-tissue-massage.png`,
      bookingLink:
        "https://book.squareup.com/appointments/xe96ggmxltf5b6/location/L3RH0J52JYVYX/services/XUTTN7KL3DTXNE2QG2GV66TM",
    },
    {
      text: `Foot Massage`,
      subtext: `Targeted pressure point massage to relieve tension and stress in the feet, promoting full-body relaxation.`,
      price: `Price: $80 for 60 minutes`,
      image: `/foot_massage.png`,
      bookingLink:
        "https://book.squareup.com/appointments/xe96ggmxltf5b6/location/L3RH0J52JYVYX/services/WIC7FDNK2YNJTKPRMZZUHJNW",
    },
    {
      text: `Combo Massage`,
      subtext: `A complete relaxation with our signature combination of full-body massage and specialized foot therapy.`,
      price: `Price: $89 for 60 minutes`,
      image: `/combo_massage.webp`,
      bookingLink:
        "https://book.squareup.com/appointments/xe96ggmxltf5b6/location/L3RH0J52JYVYX/services/6RSKXJ4P5DW6BA3YHTW43NNH",
    },
  ],
}

export const giftCards: ContentSection = {
  header: ``,
  subheader: ``,
  image: ``,
  content: [
    {
      text: `Give the Gift of Relaxation`,
      subtext: `Transform any occasion into a memorable experience with our massage gift cards. Perfect for birthdays, anniversaries, or showing appreciation to someone special.`,
      price: `Price: $100 for 60 minutes`,
      icon: "giftCard",
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
