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
  header: ``,
  subheader: ``,
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
      price: `$45 - $65`,
      image: `/foot_massage.png`,
      bookingLink:
        "https://book.squareup.com/appointments/xe96ggmxltf5b6/location/L3RH0J52JYVYX/services/WIC7FDNK2YNJTKPRMZZUHJNW",
    },
    {
      text: `Twilight Special Combo`,
      subtext: `A perfect blend of traditional foot massage and lower body treatment for complete relaxation.`,
      duration: `90 minutes`,
      price: `$110 - $120`,
      image: `/combo_massage.webp`,
      bookingLink:
        "https://book.squareup.com/appointments/xe96ggmxltf5b6/location/L3RH0J52JYVYX/services/3IJ3HKTG3B7MHP6FKF62G4IL",
    },
    {
      text: `Head-to-Toe Reset`,
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
      subtext: `A rhythmic technique using a specialized machine that encourages the natural movement of lymph fluid to reduce swelling, support detoxification, and boost the immune system.`,
      duration: `30-60 minutes`,
      price: `$60 - $120`,
      image: `/machine_assisted_lymphatic_drainage.webp`,
      bookingLink:
        "https://book.squareup.com/appointments/xe96ggmxltf5b6/location/L3RH0J52JYVYX/services/ZGR7PXCQ2B2P3PPFH42T342V",
    },
    {
      text: `Chest Care Massage`,
      subtext: `A gentle, hands-on massage that stimulates natural lymph flow, including the chest area, to reduce swelling, support detox, and improve circulation. Ideal for post-surgery recovery, bloating, or overall wellness.`,
      duration: `30 minutes`,
      price: `$60`,
      image: `/chest-care-massage.webp`,
      bookingLink:
        "https://book.squareup.com/appointments/xe96ggmxltf5b6/location/L3RH0J52JYVYX/services/ZGR7PXCQ2B2P3PPFH42T342V",
    },
    {
      text: `Abdominal Detox Massage`,
      subtext: `A gentle abdominal massage that promotes digestion, relieves tension, and supports reproductive health. Great for bloating, fatigue, or menstrual discomfor`,
      duration: `30 minutes`,
      price: `$60`,
      image: `/abdominal-detox-massage.jpg`,
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
      text: `Bronze`,
      subtext: `A $100 gift card for a perfect introduction to relaxation. Enjoy a soothing massage session or spa service.`,
      price: `$100 Gift Card`,
      benefits: [
        "Redeemable for any service",
        "Beautifully packaged",
        "No expiration date",
      ],
      icon: "giftCard",
    },
    {
      text: `Silver`,
      subtext: `A $300 gift card for a balanced experience. Ideal for those seeking both relaxation and rejuvenation.`,
      price: `$300 Gift Card`,
      benefits: [
        "Redeemable for any service",
        "Beautifully packaged",
        "No expiration date",
      ],
      icon: "giftCard",
    },
    {
      text: `Gold`,
      subtext: `A $500 gift card for a luxurious escape. Extended time and premium enhancements for the ultimate pampering.`,
      price: `$500 Gift Card`,
      benefits: [
        "Redeemable for any service",
        "Beautifully packaged",
        "No expiration date",
      ],
      icon: "giftCard",
    },
    {
      text: `Diamond`,
      subtext: `A $1000 gift card for the ultimate indulgence. A full spa experience for those who deserve the very best.`,
      price: `$1000 Gift Card`,
      benefits: [
        "Redeemable for any service",
        "Beautifully packaged",
        "No expiration date",
      ],
      icon: "giftCard",
    },
  ],
}
