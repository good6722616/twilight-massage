"use client"

import Image from "next/image"
import { useRef } from "react"
import { featureCards } from "@/config/contents"
import { ArrowRight, ArrowLeft } from "lucide-react"

export default function FeatureCards() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current
    if (!container) return
    const card = container.querySelector(".feature-card") as HTMLElement
    if (!card) return
    const scrollAmount = card.offsetWidth + 24 // 24px gap
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  return (
    <section className="bg-[#FFF9F5] py-16 lg:py-24">
      <div className="mx-auto px-4">
        <div className="flex flex-col items-center gap-8 lg:flex-row">
          {/* Left: Title and Description */}
          <div className="min-w-[280px] max-w-lg flex-1 text-center lg:w-1/2 lg:pl-20 lg:text-left">
            <h2 className="mb-4 font-serif text-4xl leading-tight text-[#342b20]">
              Our top
              <br />
              services
            </h2>
            <p className="mb-8 text-[#342b20]">
              Discover our most popular services, carefully designed to help you
              relax, refresh, and renew.
            </p>
            <div className="flex justify-center gap-4 lg:justify-start">
              <button
                aria-label="Scroll left"
                onClick={() => scroll("left")}
                className="rounded-full border border-[#A6644C] p-2 text-[#A6644C] transition hover:bg-[#A6644C] hover:text-white"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <button
                aria-label="Scroll right"
                onClick={() => scroll("right")}
                className="rounded-full border border-[#A6644C] p-2 text-[#A6644C] transition hover:bg-[#A6644C] hover:text-white"
              >
                <ArrowRight className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Right: Carousel */}
          <div className="w-full flex-1 lg:w-1/2">
            <div
              ref={scrollRef}
              className="hide-scrollbar flex gap-6 overflow-x-hidden scroll-smooth pb-4"
            >
              {featureCards.content.map((card, index) => (
                <div
                  key={card.text}
                  className="feature-card m-0 flex w-full flex-shrink-0 flex-col bg-[#FFF9F5] p-0 lg:min-w-[24%] lg:max-w-[24%]"
                >
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                      src={card.image || "/default-image.png"}
                      alt={card.text}
                      fill={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      style={{ objectFit: "cover" }}
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-left font-serif text-2xl text-[#342b20]">
                      {card.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Add this to your global CSS or Tailwind config:
// .hide-scrollbar::-webkit-scrollbar { display: none; }
// .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
