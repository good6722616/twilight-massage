"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { giftCards } from "@/config/contents"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { CheckCircle, Plus, Minus } from "lucide-react"

export default function GiftCards() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="bg-[#FFF9F5] py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center font-serif text-4xl font-normal text-[#342b20] md:text-5xl">
          Gift a moment of relaxation
        </h2>
        <div className="flex flex-col items-center gap-12 md:flex-row md:items-start md:justify-center">
          {/* Left: Image */}
          <div className="relative mx-auto h-[260px] w-[260px] overflow-hidden rounded-t-[50%] bg-[#e5ded3] md:h-[520px] md:w-[480px] lg:h-[700px] lg:w-[600px]">
            <Image
              src="/gift_hero_img.jpg"
              alt="Gift Card Room"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
              priority
            />
          </div>
          {/* Right: Accordion */}
          <div className="w-full max-w-xl space-y-4">
            {giftCards.content.map((card, idx) => (
              <div key={card.text} className="border-b border-[#e5e0d6] pb-6">
                <button
                  className="flex w-full items-center justify-between py-4 text-left font-serif text-3xl text-[#342b20] focus:outline-none"
                  onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                  aria-expanded={openIndex === idx}
                  aria-controls={`giftcard-panel-${idx}`}
                >
                  {card.text}
                  <span className="ml-2 flex h-8 w-8 items-center justify-center rounded-full border border-[#342b20]">
                    {openIndex === idx ? (
                      <Minus size={20} />
                    ) : (
                      <Plus size={20} />
                    )}
                  </span>
                </button>
                {openIndex === idx && (
                  <motion.div
                    id={`giftcard-panel-${idx}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="pl-2 pr-4"
                  >
                    <p className="mb-4 text-base text-[#6d6252]">
                      {card.subtext}
                    </p>
                    {card.benefits && (
                      <ul className="mb-4 space-y-2">
                        {card.benefits.map((benefit: string) => (
                          <li
                            key={benefit}
                            className="flex items-center text-base text-[#342b20]"
                          >
                            <CheckCircle className="mr-2 h-5 w-5 text-[#a6644c]" />
                            <span className="font-semibold">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mb-4 text-2xl text-[#342b20]">
                      {card.price}
                    </div>
                    <Button
                      className="rounded-full bg-[#a6644c] px-8 py-2 text-base font-semibold text-white shadow-md transition hover:bg-[#8a523a]"
                      size="lg"
                      aria-label="Buy Gift Card"
                      asChild
                    >
                      <a href="/giftcard">Buy Gift Card</a>
                    </Button>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
