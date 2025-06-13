"use client"

import { motion } from "framer-motion"
import { useState, useRef, useEffect } from "react"

export default function ServiceHero() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 3) {
      setIsVideoLoaded(true)
    }
  }, [])

  return (
    <section
      className="relative h-[80vh] min-h-[400px] w-full overflow-hidden"
      aria-label="Massage Services Introduction"
    >
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          src="/massage-2-short.mp4"
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          className={`h-full w-full object-cover transition-opacity duration-700 ${
            isVideoLoaded ? "opacity-100" : "opacity-0"
          }`}
          aria-label="Background video showing massage therapy techniques"
        />
      </div>
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
            Professional Massage Services
          </motion.h1>
          <motion.p
            className="mb-8 text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Experience the perfect blend of traditional techniques and modern
            therapy for ultimate relaxation and wellness at Twilight Massage &
            Spa.
          </motion.p>
          <motion.div
            className="flex space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <a
              href="https://book.squareup.com/appointments/xe96ggmxltf5b6/location/L3RH0J52JYVYX/services"
              className="inline-flex items-center rounded-full bg-orange-600 px-6 py-3 font-bold text-white transition duration-300 hover:bg-orange-700"
              aria-label="Book a massage appointment"
            >
              Book Your Massage
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
