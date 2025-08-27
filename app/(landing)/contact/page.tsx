import ContactForm from "@/components/pages/contact-form"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

export default function ContactPage() {
  return (
    <main>
      <section className="container mx-auto py-32 lg:py-32">
        <div className="mb-16 text-center">
          <h1 className="mb-6 text-4xl font-bold text-gray-900 lg:text-5xl">
            Contact Us
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            We&#39;d love to hear from you. Get in touch with us for any
            questions about our services.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2">
          <Card className="overflow-hidden border-none shadow-none">
            <CardHeader>
              <h2 className="text-3xl font-bold text-orange-800">
                Get In Touch
              </h2>
              <p className="text-lg text-gray-600">
                We&apos;re here to answer any questions you may have about our
                services. Reach out to us and we&apos;ll respond as soon as we
                can.
              </p>
            </CardHeader>

            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <MapPin className="h-6 w-6 text-orange-600" />
                  <p className="text-gray-700">
                    23805 El Toro Rd, Lake Forest, CA 92630
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="h-6 w-6 text-orange-600" />
                  <p className="text-gray-700">(949) 697-3888</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="h-6 w-6 text-orange-600" />
                  <p className="text-gray-700">twilightmassagespa@gmail.com</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Clock className="h-6 w-6 text-orange-600" />
                  <p className="text-gray-700">
                    Mon-Sat: 9am-8pm, Sun: 10am-6pm
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-none">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-orange-800">
                Send us a message
              </h2>
            </CardHeader>
            <CardContent className="p-0">
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
