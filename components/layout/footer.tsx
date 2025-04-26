import Link from "next/link"
import { siteConfig } from "@/config/site"
import { navLinks } from "@/lib/links"
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#e5e0d6] bg-[#FAF6ED]">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-12 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-24">
          {/* Left: Newsletter */}
          <div className="flex flex-col items-center justify-center text-center md:items-start md:text-left">
            <h2 className="mb-4 font-serif text-4xl text-[#342b20]">
              Subscribe to our newsletter!
            </h2>
            <p className="mb-6 max-w-md text-[#6d6252]">
              Stay updated on special offers, new services, and wellness tips —
              straight to your inbox. Subscribe to our newsletter and be the
              first to know!
            </p>
            <form className="mb-6 flex w-full max-w-md items-center overflow-hidden rounded-full border border-[#b8a98a] bg-white px-4 py-2 shadow-sm">
              <input
                type="email"
                placeholder="Enter your email address"
                className="min-w-0 flex-1 border-none bg-transparent px-2 py-2 text-[#342b20] placeholder-[#b8a98a] focus:outline-none"
              />
              <button
                type="submit"
                className="ml-2 flex-shrink-0 rounded-full bg-[#a6644c] px-6 py-2 font-semibold text-white shadow-md transition hover:bg-[#8a523a]"
              >
                Subscribe
              </button>
            </form>
            <div className="flex justify-center space-x-4 md:justify-start">
              <Button variant="ghost" size="icon" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-[#342b20]" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Instagram">
                <Instagram className="h-5 w-5 text-[#342b20]" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-[#342b20]" />
              </Button>
            </div>
          </div>

          {/* Right: Links */}
          <div className="flex flex-col gap-8 border-t border-[#e5e0d6] text-[#342b20] md:grid md:grid-cols-2 md:gap-8 md:border-l md:border-t-0 md:pl-12">
            {/* Pages */}
            <div>
              <h3 className="mb-3 font-serif text-lg font-semibold">Pages</h3>
              <ul className="space-y-2 text-[16px]">
                {navLinks.slice(0, 7).map((link) => (
                  <li key={link.route}>
                    <Link
                      href={link.path}
                      className="transition-colors hover:text-[#a6644c] hover:underline"
                    >
                      {link.route}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Contact */}
            <div>
              <h3 className="mb-3 font-serif text-lg font-semibold">Contact</h3>
              <address className="space-y-2 text-[16px] not-italic">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-[#a6644c]" />
                  <span>23805 El Toro Rd, Lake Forest, CA 92630</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-[#a6644c]" />
                  <a
                    href="tel:+19496973888"
                    className="transition-colors hover:text-[#a6644c] hover:underline"
                  >
                    (949) 697-3888
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-[#a6644c]" />
                  <a
                    href="mailto:twilightmassagespa@gmail.com"
                    className="transition-colors hover:text-[#a6644c] hover:underline"
                  >
                    twilightmassagespa@gmail.com
                  </a>
                </div>
              </address>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom bar */}
      <div className="border-t border-[#e5e0d6] bg-[#f3ede5] py-6">
        <div className="flex flex-col items-center justify-center">
          <span className="mb-2 font-serif text-xl text-[#342b20]">
            {siteConfig.name}
          </span>
          <span className="text-sm text-[#6d6252]">
            © {new Date().getFullYear()} Twilight Massage. All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  )
}
