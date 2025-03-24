"use client"

import { motion } from "framer-motion"
import GiftCardHero from "@/components/pages/giftcard-hero"
import { Button } from "@/components/ui/button"

import Image from "next/image"

const giftCards = [
  {
    title: "Classic Design",
    description:
      "Elegant black design perfect for any occasion. Give the gift of relaxation and wellness.",
    image: "/TM_Gift_Black.jpg",
  },
  {
    title: "Romantic Design",
    description:
      "Beautiful pink design ideal for couples and special occasions.",
    image: "/TM_Gift_Pink.jpg",
  },
  {
    title: "Premium Design",
    description:
      "Stunning orange design for those who deserve something special.",
    image: "/TM-Gift-Orange.jpg",
  },
]

export default function GiftCardPage() {
  const handlePurchase = () => {
    window.open("https://app.squareup.com/gift/ML1ZNNMDN2F46/order", "_blank")
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <GiftCardHero />

      <section className="container mx-auto px-4 py-12 lg:py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">
            Choose Your Gift Card Design
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Give the perfect gift of relaxation. Select your preferred design
            and customize the amount during checkout.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {giftCards.map((card, index) => (
            <motion.div
              key={card.title}
              className="overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative aspect-[3/2] w-full">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  {card.title}
                </h3>
                <p className="mb-6 text-gray-600">{card.description}</p>
                <Button
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  onClick={handlePurchase}
                >
                  Purchase Gift Card
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  )
}
