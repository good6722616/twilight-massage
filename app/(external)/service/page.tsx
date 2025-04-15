import ServiceHero from "@/components/pages/service-hero"
import ServiceCards from "@/components/pages/service-cards"

export default function ServicePage() {
  return (
    <main className="min-h-screen">
      <ServiceHero />
      <div className="container mx-auto px-4 py-8">
        <ServiceCards />
      </div>
    </main>
  )
}
