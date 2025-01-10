"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import GiftCardHero from "@/components/pages/giftcard-hero"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Gift, CreditCard, Mail } from "lucide-react"

export default function GiftCardPage() {
  const [amount, setAmount] = useState("50")

  return (
    <main className="min-h-screen">
      <GiftCardHero />

      <section className="px-4 py-16" id="order-form">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="rounded-lg bg-white p-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="mb-6 text-3xl font-bold text-orange-800">
              Order Your Gift Card
            </h2>
            <form className="space-y-6">
              <div>
                <Label htmlFor="recipient-name">Recipient&apos;s Name</Label>
                <Input
                  id="recipient-name"
                  placeholder="Enter recipient's name"
                />
              </div>
              <div>
                <Label htmlFor="recipient-email">Recipient&apos;s Email</Label>
                <Input
                  id="recipient-email"
                  type="email"
                  placeholder="Enter recipient's email"
                />
              </div>
              <div>
                <Label htmlFor="amount">Gift Card Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter gift card amount"
                />
              </div>
              <div>
                <Label htmlFor="message">Personal Message (Optional)</Label>
                <textarea
                  id="message"
                  className="w-full rounded-md border border-gray-300 p-2"
                  rows={4}
                  placeholder="Enter your personal message"
                />
              </div>
              <div>
                <Label>Delivery Method</Label>
                <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Button
                    variant="outline"
                    className="flex items-center justify-center space-x-2"
                  >
                    <Mail className="h-5 w-5" />
                    <span>Email Delivery</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center justify-center space-x-2"
                  >
                    <Gift className="h-5 w-5" />
                    <span>Print at Home</span>
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Purchase Gift Card (${amount})
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
