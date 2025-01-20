"use client"

import { motion } from "framer-motion"

export default function BookingHero() {
  return (
    <section className="relative h-[50vh] min-h-[300px] w-full bg-gradient-to-b from-orange-950 to-neutral-900">
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
            Schedule Your Appointment
          </motion.h1>
          <motion.p
            className="text-lg text-neutral-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Choose your preferred massage service and schedule a time that works
            best for you. Your path to tranquility begins here.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
