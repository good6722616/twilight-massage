import Hero from "@/components/pages/hero"
import FeatureCards from "@/components/pages/feature-cards"
import GiftCard from "@/components/pages/giftcard"
import ImageCarousel from "@/components/pages/image-carousel"
export default function Home() {
  return (
    <main>
      <Hero />
      <FeatureCards />
      <GiftCard />
      <ImageCarousel />
    </main>
  )
}
