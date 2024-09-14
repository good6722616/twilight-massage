import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { heroHeader } from "@/config/contents"
import Navbar from "@/components/layout/navbar"
export default function HeroHeader() {
  return (
    <section className="relative flex h-[800px] w-full flex-col gap-4 pb-12 pt-4 text-center lg:items-center lg:gap-8 lg:py-20">
      {/* Background Video */}
      <video
        src="/sunset.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay for darkening the video */}

      <Navbar />
      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-4 text-center lg:gap-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white lg:text-8xl">
            {heroHeader.header}
          </h1>
          <h2 className="text-lg font-bold text-black text-muted-foreground lg:text-4xl">
            {heroHeader.subheader}
          </h2>
        </div>
        <Link
          href="https://github.com/redpangilinan/next-shadcn-landing"
          target="_blank"
          className={`h-[3rem] w-[12rem] rounded-full bg-[#FFD700] text-xl text-black ${cn(buttonVariants({ size: "lg", variant: "outline" }))}`}
        >
          Book Now
        </Link>
      </div>
    </section>
  )
}
