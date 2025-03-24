"use client"

import { motion } from "framer-motion"
import { Mail, Phone } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export default function ContactHero() {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const email = "twilightmassagespa@gmail.com"
  const phone = "(949) 697-3888"

  return (
    <section
      className="relative h-[50vh] min-h-[300px] w-full overflow-hidden"
      aria-label="Contact Twilight Massage & Spa"
    >
      <Image
        src="/contact-hero.png"
        alt="Twilight Massage & Spa contact information and customer support"
        fill={true}
        style={{ objectFit: "cover" }}
        className={`z-0 transition-opacity duration-700 ${
          isImageLoaded ? "opacity-100" : "opacity-0"
        }`}
        priority={true}
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
            Contact Twilight Massage & Spa
          </motion.h1>
          <motion.p
            className="mb-4 text-lg text-neutral-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Reach out to us for appointments, inquiries, or any questions you
            may have. We&apos;re here to help you on your journey to relaxation.
            Located in Lake Forest, CA.
          </motion.p>
          <motion.div
            className="flex space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center rounded-full bg-orange-600 px-6 py-3 font-bold text-white transition duration-300 hover:bg-orange-700"
              aria-label={`Email us at ${email}`}
            >
              <Mail className="mr-2" aria-hidden="true" />
              Email Us
            </a>
            <a
              href={`tel:+19496973888`}
              className="inline-flex items-center rounded-full bg-white px-6 py-3 font-bold text-orange-800 transition duration-300 hover:bg-orange-100"
              aria-label={`Call us at ${phone}`}
            >
              <Phone className="mr-2" aria-hidden="true" />
              Call Now
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
