"use client"

import Image from "next/image"
import HeadingText from "@/components/heading-text"
import { featureCards } from "@/config/contents"
import { Button } from "@/components/ui/button"

export default function ServiceCards() {
  return (
    <section
      className="space-y-6 py-8 lg:py-16"
      aria-label="Available Massage Services"
    >
      {featureCards.header || featureCards.subheader ? (
        <HeadingText subtext={featureCards.subheader} className="text-center">
          {featureCards.header}
        </HeadingText>
      ) : null}

      <div
        className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        role="list"
        aria-label="Massage service options"
      >
        {featureCards.content.map((service) => (
          <article
            key={service.text}
            className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
            role="listitem"
          >
            <div className="relative h-[220px] w-full overflow-hidden">
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 to-transparent" />
              <Image
                src={service.image || "/default-image.png"}
                alt={`${service.text} massage service at Twilight Massage & Spa`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={false}
              />
              <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
                <h2 className="text-xl font-bold text-white">{service.text}</h2>
              </div>
            </div>

            <div className="flex flex-1 flex-col space-y-3 p-5">
              <p className="text-base text-muted-foreground">
                {service.subtext}
              </p>
              {service.duration && (
                <div className="flex items-center space-x-2 rounded-md bg-orange-50 px-3 py-1.5 dark:bg-orange-900/20">
                  <span className="text-sm font-medium text-orange-800 dark:text-orange-300">
                    Duration:
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {service.duration}
                  </span>
                </div>
              )}
              <div className="mt-auto flex items-center justify-between">
                <p className="text-lg font-semibold text-primary">
                  {service.price}
                </p>
                <Button
                  className="bg-orange-800 text-white hover:bg-orange-900"
                  onClick={() => window.open(service.bookingLink, "_blank")}
                  aria-label={`Book ${service.text} massage treatment`}
                >
                  Book Now
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
