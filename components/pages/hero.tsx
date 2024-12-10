import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Navbar from "@/components/layout/navbar"
import Image from "next/image"
import CountdownTimer from "@/components/ui/countdown-timer"
import AnnouncementBanner from "@/components/ui/announcement-banner"
import { Button } from "@/components/ui/button"
export default function HeroHeader() {
  const openingDate = new Date("2023-12-31T00:00:00")
  return (
    <section className="relative flex h-[1000px] w-full flex-col gap-4 pb-12 pt-4 text-center lg:items-center lg:gap-8 lg:py-20">
      {/* Background Video */}
      <video
        src="/sunset.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black opacity-50"></div>
      {/* Overlay for darkening the video */}

      <Navbar />

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-4 text-center lg:gap-8">
        <div className="space-y-1">
          <div className="">
            <Image
              src="/twilight_white_crop.png"
              alt="Twilight Massage & Spa Logo"
              quality={100}
              width={600}
              height={600}
              priority={true}
              className="mx-auto"
            />
          </div>
        </div>
        <CountdownTimer targetDate={openingDate} />
        <Button className="mb-2 me-2 rounded-lg  bg-white px-10 py-6 text-center text-2xl font-medium text-gray-900 hover:bg-gray-200 dark:focus:ring-blue-800">
          Book Now
        </Button>
      </div>
    </section>
  )
}
