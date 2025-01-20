"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { siteConfig } from "@/config/site"
import { navLinks } from "@/lib/links"
import { Menu, X } from "lucide-react"
import Image from "next/image"
export default function Navbar() {
  const [navbar, setNavbar] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const handleClick = () => {
    setNavbar(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header
      className={`fixed top-0 z-50 w-full select-none transition-colors duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between py-6">
          <Link
            href="/"
            onClick={handleClick}
            className="flex items-center gap-2"
          >
            <div className="relative h-16 w-16">
              <Image
                src="/twilight_white_crop.png"
                alt="Logo"
                fill
                className={`absolute object-contain transition-opacity duration-300 ${
                  scrolled ? "invisible opacity-0" : "visible opacity-100"
                }`}
              />
              <Image
                src="/twilight_white_crop.png"
                alt="Logo"
                fill
                className={`absolute object-contain transition-opacity duration-300 ${
                  scrolled
                    ? "visible opacity-100 brightness-0 hue-rotate-[335deg] saturate-[80] sepia-[.75]"
                    : "invisible opacity-0"
                }`}
              />
            </div>
            <span
              className={`absolute text-xl font-bold transition-all duration-300 ${
                scrolled
                  ? "relative text-orange-800 opacity-100"
                  : "relative text-white opacity-100"
              }`}
            >
              {siteConfig.name}
            </span>
          </Link>
          <div className="hidden md:block">
            <ul className="flex space-x-6">
              {navLinks.map((link) => (
                <li key={link.route}>
                  <Link
                    className={`group relative transition-colors duration-300 hover:text-orange-500 ${
                      scrolled ? "text-gray-800" : "text-white"
                    }`}
                    href={link.path}
                  >
                    {link.route}
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-orange-500 transition-all duration-300 hover:w-full group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <button
            className={`rounded-md p-2 transition-colors duration-300 md:hidden ${
              scrolled ? "text-orange-800" : "text-white"
            }`}
            aria-label="Toggle Menu"
            onClick={() => setNavbar(!navbar)}
          >
            {navbar ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {navbar && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg md:hidden"
          >
            <div className="flex h-full flex-col justify-between p-6">
              <ul className="space-y-4">
                {navLinks.map((link) => (
                  <motion.li
                    key={link.route}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Link
                      className="text-lg font-medium text-gray-800 transition-colors hover:text-orange-500"
                      href={link.path}
                      onClick={handleClick}
                    >
                      {link.route}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="text-sm text-gray-500">
                © {new Date().getFullYear()} {siteConfig.name}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {navbar && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={handleClick}
        />
      )}
    </header>
  )
}
