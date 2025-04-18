"use client"
import { useState, useRef, useEffect } from "react"
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
          <div className="relative mb-6 inline-block">
            <div className="absolute -left-4 -top-4 animate-pulse">
              <Heart className="h-8 w-8 text-rose-400" />
            </div>
            <div
              className="absolute -right-4 -top-4 animate-pulse"
              style={{ animationDelay: "0.5s" }}
            >
              <Heart className="h-8 w-8 text-rose-400" />
            </div>
            <h2 className="relative z-10 mb-4 bg-gradient-to-r from-rose-400 via-purple-400 to-rose-400 bg-clip-text text-4xl font-bold text-transparent">
              Mother&apos;s Day Special
            </h2>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 transform">
              <Sparkles className="h-6 w-6 text-amber-300" />
            </div>
          </div>
          <div className="relative rounded-lg border border-rose-400/30 bg-black/40 p-6 backdrop-blur-sm">
            <div className="absolute -right-3 -top-3 rounded-full bg-gradient-to-r from-rose-400 to-purple-400 p-2">
              <Gift className="h-5 w-5 text-white" />
            </div>
            <p className="mb-4 text-2xl font-medium text-gray-200">
              Gift Card Promotion:
            </p>
            <ul className="mb-4 space-y-2 text-left text-xl text-gray-300">
              <li className="flex items-center">
                <span className="mr-2 text-rose-400">•</span> Spend $100 - Get
                $10 Free
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-rose-400">•</span> Spend $150 - Get
                $20 Free
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-rose-400">•</span> Spend $250 - Get
                $40 Free
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-rose-400">•</span> Spend $400 - Get
                $80 Free
              </li>
            </ul>
            <p className="mb-4 text-xl text-gray-300">
              Perfect for treating the special mother in your life this Mother's
              Day!
            </p>
            <Link
              href="/giftcard"
              className="inline-flex items-center text-lg font-medium text-rose-400 hover:text-rose-300 hover:underline"
            >
              Shop Gift Cards & Save Today <span className="ml-1">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
