"use client"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"

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
          src="/sunset.mp4"
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
              width={600}
              height={600}
              priority={true}
              className={`mx-auto h-auto w-auto transition-opacity duration-500 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setIsImageLoaded(true)}
            />
          </div>
        </div>
        <Button className="mb-2 me-2 rounded-lg bg-white px-10 py-6 text-center text-2xl font-medium text-gray-900 hover:bg-gray-200 dark:focus:ring-blue-800">
          Book Now
        </Button>
      </div>
    </section>
  )
}
