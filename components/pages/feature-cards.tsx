"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { featureCards } from "@/config/contents"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SpadeIcon as Spa, ArrowRight } from "lucide-react"

export default function FeatureCards() {
  return (
    <section className="bg-gradient-to-b from-orange-50 to-white py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          className="space-y-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {featureCards.header || featureCards.subheader ? (
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-orange-800 lg:text-4xl">
                {featureCards.header}
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                {featureCards.subheader}
              </p>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {featureCards.content.map((card, index) => (
              <motion.div
                key={card.text}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="group flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
                  <CardHeader className="p-0">
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={card.image || "/default-image.png"}
                        alt={card.text}
                        fill={true}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        style={{ objectFit: "cover" }}
                        className="transition-transform duration-300 group-hover:scale-110"
                        priority={index === 0}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow p-6">
                    <CardTitle className="mb-2 text-2xl font-bold text-orange-800">
                      {card.text}
                    </CardTitle>
                    <p className="text-gray-600">{card.subtext}</p>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button
                      className="w-full bg-orange-600 text-white transition-colors hover:bg-orange-700"
                      onClick={() => window.open(card.bookingLink, "_blank")}
                    >
                      Book Now
                      <Spa className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              size="lg"
              variant="outline"
              className="mt-8 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
              onClick={() =>
                window.open(
                  "https://book.squareup.com/appointments/xe96ggmxltf5b6/location/L3RH0J52JYVYX/services",
                  "_blank"
                )
              }
            >
              Discover More Treatments
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
