"use client"

import { featureCards } from "@/config/contents"
import { Heart, Zap, User, Sparkles, Sun, Droplets } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"

export default function FeatureCards() {
  return (
    <section className="bg-[#FFF9F5] py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="font-serif text-4xl font-normal text-[#342b20] md:text-5xl">
            Our top services
          </h2>
          <Button
            asChild
            variant="outline"
            className="rounded-full border-[#a6644c] px-8 py-2 text-base font-semibold text-[#342b20] hover:bg-[#f3ede5]"
          >
            <Link href="/service">All services</Link>
          </Button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 border border-[#A6644C] font-serif sm:grid-cols-2 lg:grid-cols-3">
          {/* Swedish Massage */}
          <div className="border-b border-[#A6644C] p-10 sm:border-r lg:border-r">
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-lg bg-[#faf5f2]">
              <Heart className="h-10 w-10 text-[#342b20]" />
            </div>
            <h3 className="mb-6 text-3xl font-normal text-[#342b20]">
              Swedish Massage
            </h3>
            <p className="text-lg text-gray-600">
              A classic massage designed to relax the entire body, improve
              circulation, and relieve muscle tension.
            </p>
          </div>

          {/* Deep Tissue Massage */}
          <div className="border-b border-[#A6644C] p-10 lg:border-r">
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-lg bg-[#faf5f2]">
              <Zap className="h-10 w-10 text-[#342b20]" />
            </div>
            <h3 className="mb-6 text-3xl font-normal text-[#342b20]">
              Deep Tissue Massage
            </h3>
            <p className="text-lg text-gray-600">
              A focused, therapeutic massage to relieve muscle tension, reduce
              pain, and improve mobility.
            </p>
          </div>

          {/* Head-to-Toe Reset */}
          <div className="border-b border-[#A6644C] p-10">
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-lg bg-[#faf5f2]">
              <User className="h-10 w-10 text-[#342b20]" />
            </div>
            <h3 className="mb-6 text-3xl font-normal text-[#342b20]">
              Head-to-Toe Reset
            </h3>
            <p className="text-lg text-gray-600">
              A complete relaxation with our signature combination of full-body
              massage and specialized foot therapy.
            </p>
          </div>

          {/* Facials */}
          <div className="border-b border-[#A6644C] p-10 sm:border-r lg:border-b-0 lg:border-r">
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-lg bg-[#faf5f2]">
              <Sparkles className="h-10 w-10 text-[#342b20]" />
            </div>
            <h3 className="mb-6 text-3xl font-normal text-[#342b20]">
              Facials
            </h3>
            <p className="text-lg text-gray-600">
              Rejuvenate your skin with our professional facial treatments
              designed to cleanse, exfoliate, and nourish.
            </p>
          </div>

          {/* Thai Massage */}
          <div className="border-b border-[#A6644C] p-10 lg:border-b-0 lg:border-r">
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-lg bg-[#faf5f2]">
              <Sun className="h-10 w-10 text-[#342b20]" />
            </div>
            <h3 className="mb-6 text-3xl font-normal text-[#342b20]">
              Thai Massage
            </h3>
            <p className="text-lg text-gray-600">
              Traditional Thai massage combining acupressure, stretching, and
              yoga-like positions for full body rejuvenation.
            </p>
          </div>

          {/* Lymphatic Drainage Massage */}
          <div className="border-[#A6644C] p-10 lg:border-b-0">
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-lg bg-[#faf5f2]">
              <Droplets className="h-10 w-10 text-[#342b20]" />
            </div>
            <h3 className="mb-6 text-3xl font-normal text-[#342b20]">
              Lymphatic Drainage Massage
            </h3>
            <p className="text-lg text-gray-600">
              A rhythmic technique using a specialized machine that encourages
              the natural movement of lymph fluid to reduce swelling, support
              detoxification, and boost the immune system.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
