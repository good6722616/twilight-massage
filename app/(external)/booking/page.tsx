import BookingWidget from "@/components/pages/booking-widget"
import BookingHero from "@/components/pages/booking-hero"

export const metadata = {
  title: "Book Your Massage | Twilight Massage",
  description:
    "Schedule your relaxing massage session at Twilight Massage. Choose your preferred service, date, and time.",
}

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <BookingHero />

      <section className="container mx-auto px-4 py-16">
        <div className="space-y-12">
          <BookingWidget />
        </div>
      </section>
    </main>
  )
}
