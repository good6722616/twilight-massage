import Link from "next/link"
import { siteConfig } from "@/config/site"
import { navLinks } from "@/lib/links"
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="mt-auto bg-gradient-to-b from-orange-50 to-orange-100">
      <div className="mx-auto w-full max-w-screen-xl p-6 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-bold text-orange-800">
                {siteConfig.name}
              </h1>
            </Link>
            <p className="text-sm text-gray-600">
              Experience tranquility and rejuvenation at Twilight Massage. Our
              expert therapists are dedicated to your well-being.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-orange-700" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Instagram">
                <Instagram className="h-5 w-5 text-orange-700" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-orange-700" />
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-orange-800">
              Quick Links
            </h2>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.route}>
                  <Link
                    href={link.path}
                    className="text-gray-600 transition-colors hover:text-orange-700 hover:underline"
                  >
                    {link.route}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-orange-800">
              Contact Us
            </h2>
            <address className="not-italic">
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-5 w-5 text-orange-700" />
                <span>23805 El Toro Rd, Lake Forest, CA 92630</span>
              </div>
              <div className="mt-2 flex items-center space-x-2 text-gray-600">
                <Phone className="h-5 w-5 text-orange-700" />
                <a
                  href="tel:+19496973888"
                  className="transition-colors hover:text-orange-700 hover:underline"
                >
                  (949) 697-3888
                </a>
              </div>
              <div className="mt-2 flex items-center space-x-2 text-gray-600">
                <Mail className="h-5 w-5 text-orange-700" />
                <a
                  href="mailto:twilightmassagespa@gmail.com"
                  className="transition-colors hover:text-orange-700 hover:underline"
                >
                  twilightmassagespa@gmail.com
                </a>
              </div>
            </address>
          </div>
        </div>
        <hr className="my-8 border-orange-200" />
        <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          <span className="text-sm text-gray-600">
            © {new Date().getFullYear()} Twilight Massage. All Rights Reserved.
          </span>
          <div className="flex space-x-4 text-sm text-gray-600">
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-orange-700 hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="transition-colors hover:text-orange-700 hover:underline"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
