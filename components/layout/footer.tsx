import Link from "next/link"
import { siteConfig } from "@/config/site"
import { navLinks } from "@/lib/links"
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Image from "next/image"

export default function Footer() {
  return (
    <>
      {/* Top CTA Section */}
      <section className="bg-[#f7f2ef] py-12">
        <div className="mx-auto flex max-w-screen-2xl flex-col items-center justify-between gap-8 px-4 py-12 md:flex-row md:gap-12">
          {/* Images */}
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="relative h-40 w-60 overflow-hidden">
              <Image
                src="/TM-Gift-Orange.jpg"
                alt="Orange Gift Card"
                fill
                className="object-contain"
              />
            </div>
            <div className="relative h-40 w-60 overflow-hidden bg-[#e5ded3]">
              <Image
                src="/TM_Gift_Black.jpg"
                alt="Black Gift Card"
                fill
                className="object-contain"
              />
            </div>
          </div>
          {/* Headline and Buttons */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h2 className="mb-6 font-serif text-4xl font-normal text-[#342b20] md:text-5xl">
              Serenity achieved through
              <br />
              expert massage therapy
            </h2>
            <div className="flex gap-4">
              <Button
                asChild
                className="rounded-full bg-[#a6644c] px-8 py-2 text-base font-semibold text-white shadow-md transition hover:bg-[#8a523a]"
              >
                <a
                  href="https://book.squareup.com/appointments/xe96ggmxltf5b6/location/L3RH0J52JYVYX/services"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Reserve
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-[#a6644c] px-8 py-2 text-base font-semibold text-[#342b20] hover:bg-[#f3ede5]"
              >
                <Link href="/service">All services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <hr className="border-[#A6644C]"></hr>
      {/* Main Footer */}
      <footer className="mt-auto border-t-0 bg-[#f7f2ef]">
        <div className="mx-auto w-full max-w-screen-2xl px-4 py-12 lg:py-20">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {/* Left: Newsletter */}
            <div className="flex flex-col items-center justify-center text-center md:items-start md:text-left">
              <h2 className="mb-4 font-serif text-4xl text-[#342b20]">
                Subscribe to our newsletter!
              </h2>
              <p className="mb-6 max-w-md text-[#6d6252]">
                Stay updated on special offers, new services, and wellness tips
                — straight to your inbox. Subscribe to our newsletter and be the
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
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Facebook"
                  asChild
                >
                  <a
                    href="https://www.facebook.com/people/Twilight-Massage-Spa/61568853612590/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Facebook className="h-5 w-5 text-[#342b20]" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Instagram"
                  asChild
                >
                  <a
                    href="https://www.instagram.com/twilight.massage"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram className="h-5 w-5 text-[#342b20]" />
                  </a>
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Twitter">
                        <Twitter className="h-5 w-5 text-[#342b20]" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Coming Soon</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Right: Links */}
            <div className="flex flex-col gap-8 border-t border-[#e5e0d6] text-[#342b20] md:grid md:grid-cols-2 md:gap-8 md:border-l md:border-t-0 md:border-[#A6644C] md:pl-12">
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
                <h3 className="mb-3 font-serif text-lg font-semibold">
                  Contact
                </h3>
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
        <div className="border-t border-[#e5e0d6] bg-[#f7f2ef] py-6">
          <div className="flex flex-col items-center justify-center">
            <span className="mb-2 font-serif text-xl text-[#342b20]">
              {siteConfig.name}
            </span>
            <span className="text-sm text-[#6d6252]">
              © {new Date().getFullYear()} Twilight Massage. All Rights
              Reserved.
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}
