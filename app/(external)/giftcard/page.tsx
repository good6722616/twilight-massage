"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import GiftCardHero from "@/components/pages/giftcard-hero"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Gift, Bell, SparkleIcon } from "lucide-react"

export default function GiftCardPage() {
  const [email, setEmail] = useState("")

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <GiftCardHero />

      <section className="px-4 py-16" id="notify-form">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="rounded-lg bg-white p-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100"
              >
                <SparkleIcon className="h-8 w-8 text-orange-600" />
              </motion.div>

              <motion.h2
                className="mb-3 text-2xl font-bold text-gray-900 md:text-3xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Coming Soon!
              </motion.h2>

              <motion.p
                className="mb-8 text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                We&apos;re working on something special! Our digital gift cards
                will be available soon. Sign up to be notified when they launch.
              </motion.p>

              <motion.div
                className="mx-auto max-w-md space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="email" className="sr-only">
                    Email
                  </Label>
                  <div className="relative">
                    <Input
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pr-32"
                    />
                    <Button
                      className="absolute right-1 top-1 flex items-center gap-2"
                      size="sm"
                    >
                      <Bell className="h-4 w-4" />
                      Notify Me
                    </Button>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="mt-12 grid gap-8 text-center md:grid-cols-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div>
                  <div className="mb-4 flex justify-center">
                    <Gift className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="mb-2 font-semibold">Perfect Gift</h3>
                  <p className="text-sm text-gray-600">
                    Give the gift of relaxation to your loved ones
                  </p>
                </div>
                <div>
                  <div className="mb-4 flex justify-center">
                    <svg
                      className="h-8 w-8 text-orange-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 font-semibold">Instant Delivery</h3>
                  <p className="text-sm text-gray-600">
                    Digital delivery straight to their inbox
                  </p>
                </div>
                <div>
                  <div className="mb-4 flex justify-center">
                    <svg
                      className="h-8 w-8 text-orange-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 font-semibold">Secure & Easy</h3>
                  <p className="text-sm text-gray-600">
                    Safe payment and easy redemption
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
