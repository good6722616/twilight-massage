"use client"

import { motion } from "framer-motion"
import { MapPin } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import Link from "next/link"

export default function LocationHero() {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  return (
    <section
      className="relative h-[50vh] min-h-[300px] w-full overflow-hidden"
      aria-label="Twilight Massage & Spa Location in Lake Forest"
    >
      <Image
        src="/location_hero_img.jpg"
        alt="Twilight Massage & Spa location in Lake Forest, California"
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
            Visit Our Oasis of Tranquility in Lake Forest
          </motion.h1>
          <motion.p
            className="mb-4 text-lg text-neutral-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Conveniently located at 23805 El Toro Rd in Lake Forest, our spa
            offers a peaceful retreat from the everyday hustle. Experience
            professional massage services in a serene environment.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link
              href="https://www.google.com/maps/search/?api=1&query=23805+El+Toro+Rd+Lake+Forest+CA+92630"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-orange-600 px-6 py-3 font-bold text-white transition duration-300 hover:bg-orange-700"
              aria-label="Get directions to Twilight Massage & Spa in Lake Forest"
            >
              <MapPin className="mr-2" aria-hidden="true" />
              Get Directions
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
