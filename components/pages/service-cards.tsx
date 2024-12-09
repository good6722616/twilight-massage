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

      <div className="grid gap-8">
        {featureCards.content.map((service) => (
          <div
            key={service.text}
            className="flex flex-col gap-6 rounded-lg border p-6 md:flex-row"
          >
            <div className="relative aspect-square w-full max-w-sm">
              <Image
                src={service.image || "/default-image.png"}
                alt={service.text}
                fill
                className="rounded-lg object-cover"
              />
            </div>

            <div className="flex flex-col justify-center space-y-3">
              <h2 className="text-2xl font-bold">{service.text}</h2>
              <p className="text-lg text-muted-foreground">{service.subtext}</p>
              <p className="text-xl font-semibold text-primary">
                {service.price}
              </p>
              <Button className="w-fit">Book Now</Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
