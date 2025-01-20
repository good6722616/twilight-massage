"use client"

import { motion } from "framer-motion"
import { giftCards } from "@/config/contents"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function GiftCards() {
  return (
    <section className="bg-gradient-to-b from-orange-50 to-white py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          className="space-y-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {giftCards.header || giftCards.subheader ? (
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-bold text-orange-800 lg:text-4xl">
                {giftCards.header}
              </h2>
              <div className="flex items-center justify-center space-x-2">
                <div className="h-[1px] w-12 bg-orange-300"></div>
                <div className="relative h-12 w-12 bg-transparent">
                  <Image
                    src="/twilight_logo_black_wotext.png"
                    alt="Twilight Massage Logo"
                    fill
                    sizes="(max-width: 48px) 100vw"
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="h-[1px] w-12 bg-orange-300"></div>
              </div>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                {giftCards.subheader}
              </p>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <motion.div
              className="grid grid-cols-1 gap-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {giftCards.content.map((cards, index) => {
                const Icon = Icons[cards.icon || "giftCard"]

                return (
                  <motion.div
                    key={cards.text}
                    className="flex flex-col items-center gap-4 md:flex-row md:justify-center md:gap-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                  >
                    <div className="flex transform transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-[6rem] w-[6rem] text-orange-800" />
                    </div>
                    <div className="max-w-md flex-1 space-y-4 text-left">
                      <p className="text-2xl font-semibold text-orange-800 md:text-4xl">
                        {cards.text}
                      </p>
                      <p className="font-light text-muted-foreground md:text-lg">
                        {cards.subtext}
                      </p>
                      <Button
                        className="w-full bg-orange-800 text-white transition-colors duration-300 hover:bg-orange-900 md:w-auto"
                        size="xl"
                        aria-label="Purchase a gift card"
                        asChild
                      >
                        <a href="/giftcard">Buy a Gift Card</a>
                      </Button>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative overflow-hidden rounded-xl shadow-lg"
            >
              <div
                className="h-full w-full transform transition-transform duration-500 hover:scale-105"
                style={{
                  backgroundImage: `url("/gift_hero_img.jpg")`,
                  backgroundRepeat: `no-repeat`,
                  backgroundSize: `cover`,
                  backgroundPosition: `center`,
                  minHeight: "500px",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
