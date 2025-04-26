"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { navLinks } from "@/lib/links"
import { Menu, X } from "lucide-react"
import Image from "next/image"

export default function Navbar() {
  const [navbar, setNavbar] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className="fixed top-0 z-50 w-full bg-[#FFF9F5]">
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-[#A6644C]" />
      <nav className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/twilight_logo_horizontal_text.png"
              alt="Twilight Massage & Spa Logo"
              width={200}
              height={40}
              className="h-12 w-40"
            />
          </Link>

          <div className="hidden md:block">
            <ul className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <li key={link.route}>
                  <Link
                    className="text-sm font-light text-gray-800 transition hover:text-gray-900"
                    href={link.path}
                  >
                    {link.route}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/contact"
                  className="rounded-full border border-gray-900/20 px-6 py-2 text-sm font-light text-gray-900 transition hover:bg-gray-900 hover:text-white"
                >
                  Get in touch
                </Link>
              </li>
            </ul>
          </div>

          <button
            className="rounded-md p-2 text-gray-900 md:hidden"
            onClick={() => setNavbar(!navbar)}
          >
            {navbar ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {navbar && (
        <div className="absolute inset-x-0 top-20 bg-[#FFF9F5] p-6 shadow-lg md:hidden">
          <ul className="space-y-4">
            {navLinks.map((link) => (
              <li key={link.route}>
                <Link
                  className="block text-sm font-light text-gray-800 transition hover:text-gray-900"
                  href={link.path}
                  onClick={() => setNavbar(false)}
                >
                  {link.route}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
