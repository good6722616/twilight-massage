import ImageSlider, { SlideItem } from "../ui/imageSlider"
import { Card } from "../ui/card"

const AboutSection = () => {
  const images: SlideItem[] = [
    {
      src: "/homepage/butterfly_room-min.jpeg",
    },
    {
      src: "/homepage/aisle-min.jpeg",
    },
    {
      src: "/homepage/lobby-min.jpeg",
    },
    {
      src: "/homepage/lobby_sofa-min.jpeg",
    },
    {
      src: "/homepage/sun_room-min.jpeg",
    },
    {
      src: "/homepage/leaf_room-min.jpeg",
    },
    {
      src: "/homepage/table-min.jpeg",
    },
    {
      src: "/homepage/foot_room-min.jpeg",
    },
    {
      src: "/homepage/cloud_room-min.jpeg",
    },
    {
      src: "/homepage/bamboo_room-min.jpeg",
    },
  ]

  return (
    <section className="flex flex-col items-center justify-center gap-4 bg-[#faf5f2] py-32 md:flex-row">
      {/* 左边 Slider */}
      <div className="flex  justify-center">
        <ImageSlider images={images} />
      </div>

      {/* 右边 About Us */}
      <Card className="z-20 flex min-h-[500px] w-full max-w-[700px] flex-col items-center justify-center rounded-none border-0 bg-[#ecd8c480] p-8 text-center shadow-md md:w-[600px] md:p-20">
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
    </section>
  )
}

export default AboutSection
