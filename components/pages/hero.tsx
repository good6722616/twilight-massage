"use client"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HeroHeader() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleBooking = () => {
    window.open(
      "https://book.squareup.com/appointments/xe96ggmxltf5b6/location/L3RH0J52JYVYX/services",
      "_blank"
    )
  }

  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 3) {
      setIsVideoLoaded(true)
    }
  }, [])

  return (
    <div className="relative mt-20">
      <section className="relative flex min-h-[85vh] w-full flex-col lg:h-[85vh] lg:flex-row">
        {/* Left half - Content */}
        <div className="flex w-full items-center bg-[#FFF9F5] px-6 py-16 lg:w-1/2 lg:px-16">
          <div className="mx-auto max-w-xl">
            <div className="mb-8 flex items-center gap-3">
              <Image
                src="/twilight_logo_black_wotext.png"
                alt="Twilight Massage & Spa Logo"
                width={50}
                height={50}
                className="h-12 w-12"
              />
            </div>
            <h1 className="mb-6 font-serif text-4xl font-light leading-tight text-[#342b20] lg:text-6xl xl:text-8xl">
              Experience the Art of
              <br />
              <span className="font-normal">Relaxation & Renewal</span>
            </h1>
            <p className="mb-8 text-lg font-light leading-relaxed text-gray-600">
              Discover a sanctuary of peace where ancient healing traditions
              meet modern therapeutic techniques. Let our expert therapists
              guide you on a journey to wellness and tranquility.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={handleBooking}
                className="rounded-full bg-[#A6644C] px-8 py-4 text-base font-light text-white transition-colors hover:bg-[#95583F] lg:text-lg"
              >
                Book Your Session
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-2 border-gray-900 bg-transparent px-8 py-4 text-base font-light text-gray-900 transition-all hover:bg-gray-900 hover:text-white lg:text-lg"
              >
                <Link href="/service">Explore Services</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Divider line - only visible on desktop */}
        <div className="absolute left-1/2 top-0 hidden h-full w-[1px] bg-gradient-to-b from-transparent via-[#E8E1DC] to-transparent opacity-30 lg:block" />

        {/* Right half - Video */}
        <div className="relative h-[50vh] w-full bg-[#FFF9F5] lg:h-auto lg:w-1/2">
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
          {/* Animated Logo Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-slide-in motion-reduce:animate-none">
              <Image
                src="/twilight_logo_white.png"
                alt="Twilight Massage & Spa Logo"
                width={600}
                height={600}
                className="h-auto w-[600px]"
                priority
              />
            </div>
          </div>
        </div>
      </section>
      {/* Bottom line */}
      <div className="absolute bottom-0 h-[1px] w-full bg-[#A6644C]" />
    </div>
  )
}
