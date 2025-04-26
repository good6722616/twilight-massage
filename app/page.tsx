import Navbar from "@/components/layout/navbar"
import Hero from "@/components/pages/hero"
import AboutUs from "@/components/pages/about-us"
import FeatureCards from "@/components/pages/feature-cards"
import GiftCard from "@/components/pages/giftcard"
import ImageCarousel from "@/components/pages/image-carousel"

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <AboutUs />
      <FeatureCards />
      <GiftCard />
      <ImageCarousel />
    </main>
  )
}
