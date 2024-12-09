"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { siteConfig } from "@/config/site"
import { navLinks } from "@/lib/links"
import { settings } from "@/config/settings"

export default function Navbar() {
  const [navbar, setNavbar] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const handleClick = async () => {
    setNavbar(false)
  }

  useEffect(() => {
    if (navbar) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }, [navbar])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header
      className={`fixed top-0 z-50 h-[100px] w-full select-none transition-colors duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <nav className="h-30 container flex items-center justify-between">
        <div className="h-auto w-full">
          <div className="flex w-full items-center justify-between py-3 md:block md:py-5">
            <Link href="/" onClick={handleClick}>
              <h1
                className={`w-fit text-2xl font-bold transition-colors duration-300 ${
                  scrolled ? "text-black" : "text-white"
                }`}
              >
                {siteConfig.name}
              </h1>
            </Link>
            <div className="flex gap-1 md:hidden">
              <button
                className={`rounded-md p-2 outline-none transition-colors duration-300 focus:border focus:border-primary ${
                  scrolled ? "text-black" : "text-white"
                }`}
                aria-label="Hamburger Menu"
                onClick={() => setNavbar(!navbar)}
              >
                {navbar ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 "
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 "
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
              {/* <ModeToggle /> */}
            </div>
          </div>
        </div>
        <div>
          <div
            className={`absolute left-0 right-0 z-50 m-auto justify-self-center rounded-md border p-4 md:static md:mt-0 md:block md:border-none md:p-0 ${
              navbar ? "block" : "hidden"
            }`}
            style={{ width: "100%", maxWidth: "20rem" }}
          >
            <ul className="flex flex-col items-center space-y-4 md:flex-row md:space-x-6 md:space-y-0">
              {navLinks.map((link) => (
                <li key={link.route}>
                  <Link
                    className={`transition-colors duration-300 hover:underline ${
                      scrolled ? "text-black" : "text-white"
                    }`}
                    href={link.path}
                    onClick={handleClick}
                  >
                    {link.route}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* {settings.themeToggleEnabled && (
          <div className="hidden md:block">
            <ModeToggle />
          </div>
        )} */}
      </nav>
    </header>
  )
}
