"use client"

import { motion } from "framer-motion"
import { MapPin } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export default function LocationHero() {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  return (
    <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
      <Image
        src="/location-hero.jpg"
        alt="Our Location"
        fill={true}
        style={{ objectFit: "cover" }}
        className={`z-0 transition-opacity duration-700 ${
          isImageLoaded ? "opacity-100" : "opacity-0"
        }`}
        priority={true}
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
            className="mb-4 text-4xl font-bold md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Visit Our Oasis of Tranquility
          </motion.h1>
          <motion.p
            className="mb-8 text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Conveniently located in Lake Forest, our spa offers a peaceful
            retreat from the everyday hustle.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <a
              href="#location-map"
              className="inline-flex items-center rounded-full bg-orange-600 px-6 py-3 font-bold text-white transition duration-300 hover:bg-orange-700"
            >
              <MapPin className="mr-2" />
              Find Us
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
