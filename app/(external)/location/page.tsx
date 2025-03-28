import { MapPin, Clock, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import GoogleMap from "@/components/pages/googlemap"
import LocationHero from "@/components/pages/location-hero"
import Image from "next/image"
import Link from "next/link"

export default function LocationPage() {
  const location = "23805 El Toro Rd, Lake Forest, CA 92630"

  return (
    <main>
      <LocationHero />
      <section className="container mx-auto py-16">
        <div className="space-y-12">
          <GoogleMap location={location} />

          <Card>
            <CardContent className="grid gap-8 p-8 md:grid-cols-2">
              <div className="space-y-6">
                <h2 className="text-3xl font-semibold text-orange-800">
                  Visit Us Today
                </h2>
                <p className="text-gray-600">
                  Step into our serene environment and let the stress melt away.
                  Our expert therapists are ready to provide you with a
                  personalized massage experience that will leave you feeling
                  refreshed and renewed.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <MapPin className="h-6 w-6 text-orange-600" />
                    <p className="text-gray-700">{location}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Phone className="h-6 w-6 text-orange-600" />
                    <p className="text-gray-700">(949) 697-3888</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Mail className="h-6 w-6 text-orange-600" />
                    <p className="text-gray-700">
                      twilightmassagespa@gmail.com
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Clock className="h-6 w-6 text-orange-600" />
                    <p className="text-gray-700">Mon - Sun: 10AM - 8PM</p>
                  </div>
                </div>
                <Button className="bg-orange-600 hover:bg-orange-700" asChild>
                  <Link
                    href="https://book.squareup.com/appointments/xe96ggmxltf5b6/location/L3RH0J52JYVYX/services"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Book Your Session Now
                  </Link>
                </Button>
              </div>
              <div className="relative h-64 md:h-full">
                <Image
                  src="/entrance.png"
                  alt="Twilight Massage Entrance"
                  fill={true}
                  style={{ objectFit: "cover" }}
                  className="rounded-lg shadow-md"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
