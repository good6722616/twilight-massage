"use client"

import { motion } from "framer-motion"
import { SpadeIcon as Spa, Info } from "lucide-react"
import Image from "next/image"

export default function ServiceHero() {
  return (
    <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
      <Image
        src="/service-hero.png"
        alt="Our Services"
        fill={true}
        style={{ objectFit: "cover" }}
        className="z-0"
        priority={true}
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
            Our Luxurious Services
          </motion.h1>
          <motion.p
            className="mb-8 text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Experience the perfect blend of traditional techniques and modern
            therapy for ultimate relaxation and wellness.
          </motion.p>
          <motion.div
            className="flex space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <a
              href="#service-list"
              className="inline-flex items-center rounded-full bg-orange-600 px-6 py-3 font-bold text-white transition duration-300 hover:bg-orange-700"
            >
              <Spa className="mr-2" />
              Explore Services
            </a>
            <a
              href="#about-us"
              className="inline-flex items-center rounded-full bg-white px-6 py-3 font-bold text-orange-600 transition duration-300 hover:bg-orange-100"
            >
              <Info className="mr-2" />
              About Us
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
