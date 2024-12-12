"use client"

import Image from "next/image"
import { useState } from "react"
import { motion } from "framer-motion"
import { SpadeIcon as Spa, Star } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const images = [
  {
    src: "/swedish_massage.png",
    title: "Swedish Massage",
    description: "Relax and unwind with our signature Swedish massage",
  },
  {
    src: "/foot_massage.png",
    title: "Foot Massage",
    description: "Revitalize your feet with our specialized foot massage",
  },
  {
    src: "/swedish_massage.png",
    title: "Deep Tissue Massage",
    description: "Release tension with our deep tissue massage",
  },
  {
    src: "/foot_massage.png",
    title: "Hot Stone Massage",
    description: "Experience warmth and relaxation with hot stone therapy",
  },
  {
    src: "/swedish_massage.png",
    title: "Aromatherapy Massage",
    description: "Indulge your senses with our aromatherapy massage",
  },
  {
    src: "/foot_massage.png",
    title: "Couples Massage",
    description: "Share a relaxing experience with our couples massage",
  },
  {
    src: "/swedish_massage.png",
    title: "Sports Massage",
    description: "Enhance performance with our targeted sports massage",
  },
  {
    src: "/foot_massage.png",
    title: "Prenatal Massage",
    description: "Nurture yourself with our gentle prenatal massage",
  },
]

export default function ImageCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="w-full bg-gradient-to-b from-slate-100 to-slate-200 px-4 py-16 md:px-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <motion.h2
            className="mb-4 text-3xl font-bold text-slate-800 md:text-4xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Our Relaxing Services
          </motion.h2>
          <motion.p
            className="text-slate-600"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Discover tranquility through our range of massage therapies
          </motion.p>
        </div>
        <Carousel
          className="w-full"
          onSelect={(indexOrEvent: any) => {
            if (typeof indexOrEvent === "number") {
              setActiveIndex(indexOrEvent)
            }
          }}
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
                <motion.div
                  className="relative aspect-[3/4] w-full overflow-hidden rounded-lg shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={image.src}
                    alt={image.title}
                    fill={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="text-lg font-semibold">{image.title}</h3>
                    <p className="text-sm opacity-80">{image.description}</p>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
        <div className="mt-8 flex items-center justify-center space-x-2">
          {images.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === activeIndex ? "bg-slate-800" : "bg-slate-400"
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            />
          ))}
        </div>
        <motion.div
          className="mt-12 flex items-center justify-center space-x-4 text-slate-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Spa className="h-6 w-6" />
          <p className="text-lg font-medium">
            Experience blissful relaxation at our tranquil oasis
          </p>
          <Spa className="h-6 w-6" />
        </motion.div>
        <motion.div
          className="mt-8 flex items-center justify-center space-x-1 text-yellow-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          {[...Array(5)].map((_, index) => (
            <Star key={index} className="h-6 w-6 fill-current" />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
