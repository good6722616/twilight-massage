"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"

export default function GiftCardHero() {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  return (
    <section className="relative h-[30vh] min-h-[200px] w-full overflow-hidden">
      <Image
        src="/giftcard_sample.jpg"
        alt="Massage Gift Card"
        fill={true}
        style={{ objectFit: "cover" }}
        priority={true}
        className={`z-0 transition-opacity duration-700 ${
          isImageLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setIsImageLoaded(true)}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/70 to-black/30" />
      <div className="container relative z-20 mx-auto flex h-full items-center px-4">
        <motion.div
          className="max-w-2xl text-white"
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
            luxurious gift cards.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
