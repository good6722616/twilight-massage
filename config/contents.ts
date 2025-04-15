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
      duration: `60-90 minutes`,
      price: `$80 - $120`,
      image: `/swedish_massage.png`,
      bookingLink:
        "https://book.squareup.com/appointments/xe96ggmxltf5b6/location/L3RH0J52JYVYX/services/JP63BPFNQM2J5VYNS7XXBCQZ",
    },
    {
      text: `Deep Tissue Massage`,
      subtext: `A focused, therapeutic massage to relieve muscle tension, reduce pain, and improve mobility`,
      duration: `60-90 minutes`,
      price: `$90 - $135`,
      image: `/deep-tissue-massage.png`,
      bookingLink:
        "https://book.squareup.com/appointments/xe96ggmxltf5b6/location/L3RH0J52JYVYX/services/XUTTN7KL3DTXNE2QG2GV66TM",
    },

    {
      text: `Couples Massage`,
      subtext: `Share a relaxing experience with your loved one in our specially designed couples suite.`,
      duration: `60-90 minutes`,
      price: `$160 - $270`,
      image: `/couple-massage.jpg`,
      bookingLink:
        "https://book.squareup.com/appointments/xe96ggmxltf5b6/location/L3RH0J52JYVYX/services/UJF66VQTQI5Y3OEKDC4SJ6YE",
    },
    {
      text: `Foot Massage`,
      subtext: `Targeted pressure point massage to relieve tension and stress in the feet, promoting full-body relaxation.`,
      duration: `30-60 minutes`,
      price: `$50 - $80`,
      image: `/foot_massage.png`,
      bookingLink:
        "https://book.squareup.com/appointments/xe96ggmxltf5b6/location/L3RH0J52JYVYX/services/WIC7FDNK2YNJTKPRMZZUHJNW",
    },
    {
      text: `Foot Combo Massage`,
      subtext: `A perfect blend of traditional foot massage and lower body treatment for complete relaxation.`,
      duration: `90 minutes`,
      price: `$120 - $130`,
      image: `/combo_massage.webp`,
      bookingLink:
        "https://book.squareup.com/appointments/xe96ggmxltf5b6/location/L3RH0J52JYVYX/services/3IJ3HKTG3B7MHP6FKF62G4IL",
    },
    {
      text: `Special Combo Massage`,
      subtext: `A complete relaxation with our signature combination of full-body massage and specialized foot therapy.`,
      duration: `60-90 minutes`,
      price: `$90 - $130`,
      image: `/special-combo-massage.jpeg`,
      bookingLink:
        "https://book.squareup.com/appointments/xe96ggmxltf5b6/location/L3RH0J52JYVYX/services/6RSKXJ4P5DW6BA3YHTW43NNH",
    },
    {
      text: `Thai Massage`,
      subtext: `Traditional Thai massage combining acupressure, stretching, and yoga-like positions for full body rejuvenation.`,
      duration: `60-90 minutes`,
      price: `$100 - $150`,
      image: `/thai-massage-therapy.jpg`,
      bookingLink:
        "https://book.squareup.com/appointments/xe96ggmxltf5b6/location/L3RH0J52JYVYX/services/HGIXYBHTQLOWCQKMVZMO2MEP",
    },
    {
      text: `Lymphatic Drainage Massage`,
      subtext: `A gentle massage technique designed to improve lymph flow, reduce swelling, and support immune system function.`,
      duration: `30-60 minutes`,
      price: `$60 - $120`,
      image: `/lymphatic-drainage-massage.jpg`,
      bookingLink:
        "https://book.squareup.com/appointments/xe96ggmxltf5b6/location/L3RH0J52JYVYX/services/ZGR7PXCQ2B2P3PPFH42T342V",
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
      duration: ``,
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
