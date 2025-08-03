"use client"

import { FC } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { EffectCoverflow, Navigation, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/navigation"

export interface SlideItem {
  src: string
  title?: string
}

interface ImageSliderProps {
  images: SlideItem[]
}

const ImageSlider: FC<ImageSliderProps> = ({ images }) => {
  return (
    <Swiper
      effect="coverflow"
      grabCursor
      centeredSlides
      slidesPerView="auto"
      loop={true}
      coverflowEffect={{
        rotate: 0,
        stretch: 0,
        depth: 200,
        modifier: 1.5,
        slideShadows: false,
        scale: 0.85,
      }}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      speed={800}
      navigation
      modules={[EffectCoverflow, Navigation, Autoplay]}
      className="w-full max-w-sm md:max-w-4xl lg:max-w-5xl xl:max-w-6xl"
    >
      {images.map((img, i) => (
        <SwiperSlide
          key={i}
          style={{ width: "600px", height: "auto" }}
          className="overflow-hidden rounded-lg shadow-xl"
        >
          <img
            src={img.src}
            alt={img.title ?? `slide-${i}`}
            className="h-auto w-full object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default ImageSlider
