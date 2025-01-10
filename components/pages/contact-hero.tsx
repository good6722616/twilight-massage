"use client"

import { motion } from "framer-motion"
import { Mail, Phone } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export default function ContactHero() {
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  return (
    <section className="relative h-[30vh] min-h-[200px] w-full overflow-hidden">
      <Image
        src="/contact-hero.png"
        alt="Contact Us"
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
            className="mb-3 text-3xl font-bold md:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Get in Touch
          </motion.h1>
          <motion.p
            className="mb-4 text-lg text-neutral-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Reach out to us for appointments, inquiries, or any questions you
            may have. We&apos;re here to help you on your journey to relaxation.
          </motion.p>
          <motion.div
            className="flex space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <a
              href="mailto:twilightmassagespa@gmail.com"
              className="inline-flex items-center rounded-full bg-orange-600 px-6 py-3 font-bold text-white transition duration-300 hover:bg-orange-700"
              aria-label="Email us at twilightmassagespa@gmail.com"
            >
              <Mail className="mr-2" />
              Email Us
            </a>
            <a
              href="tel:+19496973888"
              className="inline-flex items-center rounded-full bg-white px-6 py-3 font-bold text-orange-800 transition duration-300 hover:bg-orange-100"
              aria-label="Call us at (949) 697-3888"
            >
              <Phone className="mr-2" />
              Call Now
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
