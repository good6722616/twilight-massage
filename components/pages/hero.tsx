"use client"
import { useState, useRef, useEffect } from "react"
import type { JSX } from "react"
import Image from "next/image"
import Navbar from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Heart, Gift, Sparkles } from "lucide-react"
import Link from "next/link"

export default function HeroHeader() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Check if video is already loaded
    if (videoRef.current && videoRef.current.readyState >= 3) {
      setIsVideoLoaded(true)
    }
  }, [])

  return (
    <section className="relative flex h-[1000px] w-full flex-col gap-4 bg-gray-900 pb-12 pt-4 text-center lg:items-center lg:gap-8 lg:py-20">
      {/* Background Video with loading state */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-900/60">
        <video
          ref={videoRef}
          src="https://whwiqtjg4ira7qw5.public.blob.vercel-storage.com/sunset-hzZUVI5oVwDWrAv5vXiJVKchKN7Uc2.mp4"
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          className={`h-full w-full object-cover transition-opacity duration-700 ${
            isVideoLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
      <div className="absolute inset-0 bg-black/50"></div>

      <Navbar />

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-4 text-center lg:gap-8">
        <div className="space-y-1">
          <div className="min-h-[150px]">
            <Image
              src="/twilight_white_crop.png"
              alt="Twilight Massage & Spa Logo"
              quality={100}
              width={400}
              height={150}
              priority
              loading="eager"
              sizes="(max-width: 768px) 90vw, 400px"
              className={`mx-auto h-auto w-auto transition-opacity duration-500 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setIsImageLoaded(true)}
            />
          </div>
        </div>
        <Button
          className="mb-2 me-2 rounded-lg bg-orange-600 px-10 py-6 text-center text-2xl font-medium text-white hover:bg-orange-700 dark:focus:ring-blue-800"
          onClick={() =>
            window.open(
              "https://book.squareup.com/appointments/xe96ggmxltf5b6/location/L3RH0J52JYVYX/services",
              "_blank"
            )
          }
          aria-label="Book a massage appointment"
        >
          Book Now
        </Button>
        <div className="container mx-auto max-w-3xl text-center">
          <div className="relative rounded-xl border border-rose-400/30 bg-black/40 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-rose-500/20">
            <div className="absolute -right-3 -top-3 rounded-full bg-gradient-to-r from-rose-400 to-purple-400 p-2 shadow-md">
              <Gift className="h-5 w-5 text-white" />
            </div>
            <h2 className="relative z-10 mb-4 font-serif text-2xl font-bold uppercase tracking-wider text-white md:text-4xl">
              Mother&apos;s Day Special
            </h2>
            <p className="mb-6 text-xl font-medium text-white md:text-2xl">
              Gift Card Promotion:
            </p>
            <ul className="mb-6 space-y-4 text-center text-base font-light tracking-wider text-gray-200 sm:text-lg md:space-y-3 md:text-4xl">
              <li className="flex flex-col items-center justify-center gap-1 transition-transform duration-300 hover:translate-x-1 md:flex-row md:gap-0">
                <span className="mr-3 hidden text-rose-400 md:inline">•</span>
                <span className="font-sans font-semibold tracking-widest">
                  Spend $100 - Get
                  <span className="ml-2">
                    <span className="text-rose-300">$10</span>{" "}
                    <span className="text-white">Free</span>
                  </span>
                </span>
              </li>
              <li className="flex flex-col items-center justify-center gap-1 transition-transform duration-300 hover:translate-x-1 md:flex-row md:gap-0">
                <span className="mr-3 hidden text-rose-400 md:inline">•</span>
                <span className="font-sans font-semibold tracking-widest">
                  Spend $150 - Get
                  <span className="ml-2">
                    <span className="text-rose-300">$20</span>{" "}
                    <span className="text-white">Free</span>
                  </span>
                </span>
              </li>
              <li className="flex flex-col items-center justify-center gap-1 transition-transform duration-300 hover:translate-x-1 md:flex-row md:gap-0">
                <span className="mr-3 hidden text-rose-400 md:inline">•</span>
                <span className="font-sans font-semibold tracking-widest">
                  Spend $250 - Get
                  <span className="ml-2">
                    <span className="text-rose-300">$40</span>{" "}
                    <span className="text-white">Free</span>
                  </span>
                </span>
              </li>
              <li className="flex flex-col items-center justify-center gap-1 transition-transform duration-300 hover:translate-x-1 md:flex-row md:gap-0">
                <span className="mr-3 hidden text-rose-400 md:inline">•</span>
                <span className="font-sans font-semibold tracking-widest">
                  Spend $400 - Get
                  <span className="ml-2">
                    <span className="text-rose-300">$80</span>{" "}
                    <span className="text-white">Free</span>
                  </span>
                </span>
              </li>
            </ul>
            <p className="mb-6 text-xl italic text-gray-200">
              Perfect for treating the special mother in your life this
              Mother&apos;s Day!
            </p>
            <Link
              href="/giftcard"
              className="inline-flex items-center rounded-lg bg-rose-300 px-6 py-3 text-lg font-medium text-white shadow-md transition-all duration-300 hover:bg-pink-600 hover:shadow-lg"
            >
              Shop Gift Cards & Save Today <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
