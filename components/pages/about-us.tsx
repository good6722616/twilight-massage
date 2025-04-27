import Image from "next/image"
import { Card } from "@/components/ui/card"

export default function AboutUs() {
  return (
    <section className="flex items-center justify-center bg-[#FFF9F5] py-20 md:py-40">
      <div className="relative flex min-h-[700px] w-full max-w-5xl flex-col items-center gap-8 md:flex-row">
        {/* Left: Image */}
        <div className="relative z-10 h-[480px] w-full md:h-[560px] md:w-[600px]">
          <Image
            src="/twilight_front_desk.jpg"
            alt="Massage Room"
            fill
            className="object-cover shadow-md"
            sizes="(max-width: 1024px) 100vw, 600px"
            priority
          />
        </div>
        {/* Right: Text Card */}
        <Card className="z-20 flex min-h-[500px] w-full max-w-[700px] flex-col items-center justify-center rounded-none border-0 bg-[#ecd8c480] p-8 text-center shadow-md md:absolute md:left-[400px] md:top-[320px] md:-mt-16 md:ml-32 md:w-[600px] md:p-20">
          <h2 className="mb-4 font-serif text-4xl font-normal text-[#504434]">
            About Us
          </h2>
          <p className="mb-4 text-lg text-[#504434]">
            At Twilight Massage & Spa, we believe true relaxation starts the
            moment you arrive. Tucked away in a quiet corner of the city, our
            serene space offers a welcome escape from the stresses of everyday
            life. Whether you&#39;re seeking deep healing or gentle relaxation.
          </p>
          <p className="text-lg text-[#504434]">
            our experienced therapists provide personalized, high-quality care
            tailored to your needs. Every session is thoughtfully designed to
            restore harmony to both body and mind.
          </p>
        </Card>
      </div>
    </section>
  )
}
