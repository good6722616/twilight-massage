import { MapPin, Clock, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import GoogleMap from "@/components/pages/googlemap"
import Image from "next/image"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Visit Twilight Massage | Lake Forest Location",
  description:
    "Visit our Lake Forest massage spa at 23805 El Toro Rd. Find directions, parking information, and business hours. Book your appointment today!",
  keywords: [
    "Twilight Massage location",
    "Lake Forest massage",
    "El Toro Rd massage",
    "massage spa near me",
    "massage parking",
    "massage directions",
  ],
  openGraph: {
    title: "Visit Twilight Massage | Lake Forest Location",
    description:
      "Visit our Lake Forest massage spa at 23805 El Toro Rd. Find directions, parking information, and business hours.",
    images: [
      {
        url: "/twilight-front-door-daytime.jpg",
        width: 1200,
        height: 630,
        alt: "Twilight Massage Entrance",
      },
    ],
  },
}

export default function LocationPage() {
  const location = "23805 El Toro Rd, Lake Forest, CA 92630"
  const phone = "(949) 697-3888"
  const email = "twilightmassagespa@gmail.com"
  const hours = "Mon - Sun: 10AM - 8PM"

  return (
    <main>
      <section className="container mx-auto px-4 py-40">
        <div className="mb-16 text-center">
          <h1 className="mb-6 text-4xl font-bold text-gray-900 lg:text-5xl">
            Visit Us
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Find us in the heart of Lake Forest. We&#39;re conveniently located
            with easy access and plenty of parking.
          </p>
        </div>

        <div className="space-y-8">
          {/* Main Content Card */}
          <Card className="overflow-hidden border-none shadow-none">
            <CardContent className="grid gap-6 p-4 md:grid-cols-2 md:gap-8 md:p-8">
              {/* Left Column - Location Info and Image */}
              <div className="space-y-6">
                {/* Contact Information and Image in a row */}
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-orange-700 dark:text-orange-400">
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                          <MapPin className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Address
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                          <Phone className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Phone
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {phone}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                          <Mail className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Email
                          </p>
                          <p className="break-words text-sm text-gray-700 dark:text-gray-300">
                            {email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                          <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Hours
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {hours}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Entrance Image */}
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative h-[350px] w-[250px] overflow-hidden rounded-lg shadow-md">
                      <Image
                        src="/twilight-front-door-daytime.jpg"
                        alt="Twilight Massage Entrance"
                        fill={true}
                        style={{ objectFit: "cover" }}
                        className="rounded-lg"
                        priority
                      />
                    </div>
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                      Our entrance is easily accessible with ample parking
                      available.
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  className="w-full bg-orange-600 py-4 text-base hover:bg-orange-700"
                  asChild
                >
                  <Link
                    href="https://book.squareup.com/appointments/xe96ggmxltf5b6/location/L3RH0J52JYVYX/services"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Book Your Session Now
                  </Link>
                </Button>
              </div>

              {/* Right Column - Google Map */}
              <div className="flex flex-col justify-center">
                <GoogleMap location={location} className="h-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
