"use client"

import { motion } from "framer-motion"
import { Mail, Phone } from "lucide-react"
import Image from "next/image"

export default function ContactHero() {
  return (
    <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
      <Image
        src="/contact-hero.png"
        alt="Contact Us"
        layout="fill"
        objectFit="cover"
        className="z-0"
        priority
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
            Get in Touch
          </motion.h1>
          <motion.p
            className="mb-8 text-xl"
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
              href="#contact-form"
              className="inline-flex items-center rounded-full bg-orange-600 px-6 py-3 font-bold text-white transition duration-300 hover:bg-orange-700"
            >
              <Mail className="mr-2" />
              Email Us
            </a>
            <a
              href="tel:+1234567890"
              className="inline-flex items-center rounded-full bg-white px-6 py-3 font-bold text-orange-600 transition duration-300 hover:bg-orange-100"
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
