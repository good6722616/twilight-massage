import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col">
      <Navbar />
      {/* Clip horizontal overflow from page content only; keep Navbar outside so fixed/sticky stays reliable. */}
      <div className="min-w-0 w-full max-w-full flex-1 overflow-x-clip">
        {children}
      </div>
      <Footer />
    </div>
  )
}
