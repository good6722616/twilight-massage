import Image from "next/image"
import HeadingText from "@/components/heading-text"
import { featureCards } from "@/config/contents"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"

export default function FeatureCards() {
  return (
    <section className="bg-[#fff7cf] dark:bg-slate-900">
      <div className="container space-y-8 py-12 text-center lg:py-20">
        {featureCards.header || featureCards.subheader ? (
          <HeadingText subtext={featureCards.subheader}>
            {featureCards.header}
          </HeadingText>
        ) : null}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {featureCards.content.map((cards) => {
            return (
              <Card
                key={cards.text}
                className="flex flex-grow flex-col items-center justify-between gap-4 rounded-none p-8 dark:bg-secondary"
              >
                <Image
                  src={cards.image || "/default-image.png"} // Provide a default image
                  alt={cards.text}
                  width={300}
                  height={200}
                  className="mb-4 w-full"
                  priority={true} // Added w-full class
                />
                <div className="space-y-2">
                  <CardTitle className="text-3xl font-bold">
                    {cards.text}
                  </CardTitle>
                  <CardDescription className="text-left text-xl">
                    {cards.subtext}
                  </CardDescription>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
