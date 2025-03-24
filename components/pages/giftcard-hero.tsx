"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"

export default function GiftCardHero() {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  return (
    <section
      className="relative h-[50vh] min-h-[300px] w-full overflow-hidden"
      aria-label="Twilight Massage & Spa Gift Cards Introduction"
    >
      <Image
        src="/gift_hero_img.jpg"
        alt="Twilight Massage & Spa gift cards featuring luxurious massage treatments"
        fill={true}
        style={{ objectFit: "cover" }}
        priority={true}
        className={`z-0 transition-opacity duration-700 ${
          isImageLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setIsImageLoaded(true)}
        sizes="100vw"
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-orange-950/50 to-neutral-900/90" />
      <div className="container relative z-20 mx-auto flex h-full items-center px-4">
        <motion.div
          className="max-w-2xl pt-16 text-white md:pt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="mb-3 text-3xl font-bold md:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Give the Gift of Relaxation
          </motion.h1>
          <motion.p
            className="text-lg text-neutral-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Treat your loved ones to a blissful massage experience with our
            luxurious gift cards. Perfect for any occasion, our gift cards are
            available in multiple elegant designs with customizable amounts.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
