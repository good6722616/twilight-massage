"use client"

import Image from "next/image"
import HeadingText from "@/components/heading-text"
import { featureCards } from "@/config/contents"
import { Button } from "@/components/ui/button"

export default function ServiceCards() {
  return (
    <section className="container space-y-6 py-8 lg:py-16">
      {featureCards.header || featureCards.subheader ? (
        <HeadingText subtext={featureCards.subheader} className="text-center">
          {featureCards.header}
        </HeadingText>
      ) : null}

      <div className="grid gap-4">
        {featureCards.content.map((service) => (
          <div
            key={service.text}
            className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row"
          >
            {/* Center the image container on mobile */}
            <div className="flex justify-center md:justify-start">
              <div className="relative h-[200px] w-[200px]">
                <Image
                  src={service.image || "/default-image.png"}
                  alt={service.text}
                  fill
                  className="rounded-lg object-cover"
                  sizes="(max-width: 200px) 100vw, 200px"
                />
              </div>
            </div>

            {/* Center text content on mobile */}
            <div className="flex flex-col items-center space-y-2 text-center md:items-start md:text-left">
              <h2 className="text-xl font-bold">{service.text}</h2>
              <p className="text-base text-muted-foreground">
                {service.subtext}
              </p>
              {service.duration && (
                <p className="text-sm font-medium">
                  <span className="text-orange-800">Duration:</span>{" "}
                  <span className="text-gray-700">{service.duration}</span>
                </p>
              )}
              <p className="text-lg font-semibold text-primary">
                {service.price}
              </p>
              <Button
                className="w-fit bg-orange-800 text-white hover:bg-orange-900"
                onClick={() => window.open(service.bookingLink, "_blank")}
                aria-label={`Book ${service.text} treatment`}
              >
                Book Now
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
