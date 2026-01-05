"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Sparkles, Heart, Gift, CheckCircle } from "lucide-react"

const giftCards = [
  {
    title: "Twilight Classic",
    description:
      "Elegant black and gold palette that feels timeless—perfect for clients, colleagues, and gracious hosts.",
    image: "/TM_Gift_Black.jpg",
  },
  {
    title: "Festive Blush",
    description:
      "Soft rose and copper tones to celebrate gratitude and togetherness—ideal for close friends and family.",
    image: "/TM_Gift_Pink.jpg",
  },
  {
    title: "Golden Glow",
    description:
      "Vibrant amber hues that shimmer with warmth—treat someone extraordinary to deep relaxation.",
    image: "/TM-Gift-Orange.jpg",
  },
]

const highlights = [
  {
    icon: Heart,
    title: "Perfect for Any Occasion",
    copy: "Send a restorative escape for birthdays, anniversaries, thank yous, or just because. A thoughtful way to show appreciation.",
  },
  {
    icon: Gift,
    title: "Instant Delivery",
    copy: "Deliver a warm reminder to pause and breathe. Digital cards arrive instantly with your custom message.",
  },
]

const perks = [
  "Flexible scheduling so your recipient can choose their ideal service and visit date",
  "Instant delivery via email or printable keepsake for last-minute gifting",
  "No expiration date—they can use it whenever they're ready",
]

export default function GiftCardPage() {
  const handlePurchase = () => {
    window.open("https://app.squareup.com/gift/ML1ZNNMDN2F46/order", "_blank")
  }

  return (
    <main className="bg-[#FFF9F5] py-12">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#4E3427] via-[#38251C] to-[#1F140F] py-40 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-[#A6644C]/40 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#F5E6DA]/20 blur-3xl" />
        </div>
        <div className="container relative mx-auto flex flex-col items-center gap-16 px-4 lg:flex-row lg:items-center">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em]">
              <Sparkles className="h-4 w-4" />
              The Perfect Gift
            </div>
            <h1 className="font-serif text-4xl leading-tight md:text-5xl lg:text-6xl">
              Gift Cards
            </h1>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                className="rounded-full bg-[#F5E6DA] px-8 py-4 text-base font-semibold text-[#3B2720] transition hover:bg-[#F1D8C1]"
                size="lg"
                onClick={handlePurchase}
              >
                Purchase Gift Card
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-white/80 bg-white/10 px-8 py-4 text-base text-white transition hover:border-white hover:bg-white/20 hover:text-white"
                size="lg"
                asChild
              >
                <a href="#card-designs">View Designs</a>
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-white/70">
              {perks.map((perk) => (
                <div key={perk} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#F1C9A3]" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex-shrink-0">
            <div className="absolute -left-10 -top-6 h-72 w-72 rounded-full bg-[#F1C9A3]/30 blur-3xl" />
            <div className="relative rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
              <div className="relative overflow-hidden rounded-2xl bg-white/90">
                <Image
                  src="/TM_Gift_Pink.jpg"
                  alt="Twilight Spa Gift Card"
                  width={420}
                  height={280}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
              <div className="mt-4 space-y-2 text-sm text-white/80">
                <p>Instant email delivery or printable card—your choice.</p>
                <p>Redeemable for any service at Twilight Massage & Spa.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="container mx-auto grid gap-8 px-4 py-16 md:grid-cols-2">
        {highlights.map(({ icon: Icon, title, copy }) => (
          <div
            key={title}
            className="rounded-3xl border border-[#E5DED3] bg-white/70 p-8 shadow-sm backdrop-blur"
          >
            <div className="mb-4 flex items-center gap-3 text-[#A6644C]">
              <Icon className="h-6 w-6" />
              <span className="text-lg font-semibold uppercase tracking-widest">
                {title}
              </span>
            </div>
            <p className="text-base text-[#5F5245]">{copy}</p>
          </div>
        ))}
      </section>

      {/* How It Works */}
      <section className="bg-[#F5E6DA]/60 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-serif text-3xl text-[#342B20] md:text-4xl">
              How to Share the Gift of Calm
            </h2>
            <p className="mt-3 text-base text-[#6D6252] md:text-lg">
              Send serenity in minutes—ideal for hosts, teachers, team members,
              and everyone who brightens your day.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Choose Your Design",
                copy: "Select the artwork that matches your recipient's style. Choose any value that fits your budget.",
              },
              {
                title: "Personalize Your Note",
                copy: "Add a heartfelt message—they'll read it instantly when they receive their gift card.",
              },
              {
                title: "Send or Print",
                copy: "Deliver digitally on any date or print a keepsake card. Their balance stays ready whenever they are.",
              },
            ].map((step, idx) => (
              <div
                key={step.title}
                className="rounded-3xl bg-white p-8 text-center shadow-sm"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#A6644C]/10 text-[#A6644C]">
                  <span className="text-lg font-semibold">{idx + 1}</span>
                </div>
                <h3 className="mb-3 text-lg font-semibold text-[#342B20]">
                  {step.title}
                </h3>
                <p className="text-sm text-[#6D6252]">{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Card Designs */}
      <section
        id="card-designs"
        className="container mx-auto px-4 py-16 lg:py-20"
      >
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F5E6DA] px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#A6644C]">
            <Gift className="h-4 w-4" />
            Choose Your Card
          </div>
          <h2 className="font-serif text-3xl text-[#342B20] md:text-4xl">
            Beautiful Designs, Same Relaxing Experience
          </h2>
          <p className="mt-4 text-base text-[#6D6252] md:text-lg">
            Every design arrives with a gentle reminder to pause, breathe, and
            indulge. Pick the look that matches their style.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {giftCards.map((card, index) => (
            <motion.div
              key={card.title}
              className="group relative overflow-hidden rounded-3xl border border-[#E5DED3] bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative aspect-[3/2] w-full bg-[#F8F3EC]">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-contain p-6 transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="space-y-4 p-6">
                <h3 className="text-xl font-semibold text-[#342B20]">
                  {card.title}
                </h3>
                <p className="text-sm text-[#6D6252]">{card.description}</p>
                <Button
                  className="w-full rounded-full bg-[#A6644C] py-3 text-base font-semibold text-white transition hover:bg-[#8F553A]"
                  onClick={handlePurchase}
                >
                  Purchase Gift Card
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#2A1F18] py-16 text-white">
        <div className="container mx-auto flex flex-col items-center justify-between gap-8 px-4 text-center md:flex-row md:text-left">
          <div className="space-y-3">
            <h3 className="font-serif text-3xl">
              Ready to give the perfect gift?
            </h3>
            <p className="text-white/80">
              From thoughtful gestures to grand surprises—your gift arrives
              instantly, ready to bring relaxation and renewal.
            </p>
          </div>
          <Button
            className="rounded-full bg-[#F5E6DA] px-10 py-4 text-base font-semibold text-[#2A1F18] transition hover:bg-[#F1D8C1]"
            size="lg"
            onClick={handlePurchase}
          >
            Send a Gift Card Today
          </Button>
        </div>
      </section>
    </main>
  )
}
