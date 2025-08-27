import ServiceCards from "@/components/pages/service-cards"

export default function ServicePage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-32 lg:py-32">
        <div className="mb-16 text-center">
          <h1 className="mb-6 text-4xl font-bold text-gray-900 lg:text-5xl">
            Our Services
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Discover our range of therapeutic massage services designed to
            promote relaxation, healing, and wellness.
          </p>
        </div>
        <ServiceCards />
      </div>
    </main>
  )
}
