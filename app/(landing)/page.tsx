import Hero from "@/components/pages/hero"
import AboutUs from "@/components/pages/about-us"
import FeatureCards from "@/components/pages/feature-cards"
import GiftCard from "@/components/pages/giftcard"
import AnnouncementBanner from "@/components/ui/announcement-banner"
import LoyaltyPopup from "@/components/ui/loyalty-popup"

export default function Home() {
  return (
    <main className="relative min-w-0 w-full max-w-full pt-20">
      {/* Navbar is rendered by app/(landing)/layout.tsx */}
      <AnnouncementBanner
        className="border-[#A6644C]/40 bg-gradient-to-r from-[#A6644C] to-[#95583F] text-white shadow-sm"
        contentClassName="text-base font-light leading-relaxed sm:text-lg md:text-2xl"
      >
        <p>
          <strong>Limited time:</strong> Birthday visits and military members
          receive <strong>10% off</strong>
        </p>
      </AnnouncementBanner>
      <Hero />
      <AboutUs />
      <FeatureCards />
      <GiftCard />
      <LoyaltyPopup />
    </main>
  )
}
