import BookingWidget from "@/components/pages/booking-widget"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Book Your Massage | Twilight Massage",
  description:
    "Schedule your relaxing massage session at Twilight Massage. Choose your preferred service, date, and time.",
}

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <section className="relative h-[40vh] w-full">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/booking.png")',
          }}
        >
          <div className="absolute inset-0 bg-black opacity-70" />
        </div>

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Book Your Relaxation Journey
          </h1>
          <p className="max-w-2xl text-lg md:text-xl">
            Choose your preferred massage service and schedule a time that works
            best for you. Your path to tranquility begins here.
          </p>
          <Button
            className="mt-6 bg-orange-600 text-white hover:bg-orange-700"
            size="lg"
          >
            View Services
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-semibold text-orange-800">
              Schedule Your Appointment
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Select your preferred service, date, and time below. Our expert
              therapists are ready to provide you with a personalized and
              rejuvenating experience.
            </p>
          </div>

          <BookingWidget />

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-lg bg-orange-50 p-6 shadow-md">
              <h3 className="mb-4 text-xl font-semibold text-orange-800">
                Booking Information
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="mr-2 text-orange-600">•</span>
                  Please arrive 10 minutes before your appointment time
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-orange-600">•</span>
                  24-hour cancellation notice required
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-orange-600">•</span>
                  We accept all major credit cards
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-orange-600">•</span>
                  Gift certificates available for purchase
                </li>
              </ul>
            </div>
            <div className="rounded-lg bg-orange-50 p-6 shadow-md">
              <h3 className="mb-4 text-xl font-semibold text-orange-800">
                Prepare for Your Visit
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="mr-2 text-orange-600">•</span>
                  Wear comfortable, loose-fitting clothing
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-orange-600">•</span>
                  Avoid heavy meals before your massage
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-orange-600">•</span>
                  Inform your therapist of any health concerns
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-orange-600">•</span>
                  Arrive hydrated and ready to relax
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
