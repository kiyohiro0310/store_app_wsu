import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

export function Hero() {
  const slides = [
    {
      image: "/imgs/hero1.jpg",
      title: "Discover Your Next Favorite Gadget",
      description: "Shop the latest electronics at unbeatable prices",
    },
    {
      image: "/imgs/hero2.jpg",
      title: "Upgrade Your Lifestyle",
      description: "Find the best deals on premium products",
    },
    {
      image: "/imgs/hero3.jpg",
      title: "Unleash Your Creativity",
      description: "Explore gadgets that inspire innovation",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div>
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 6000 }}
        pagination={{ clickable: true }}
        className="h-64 hero-swiper"
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex);
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="bg-cover bg-center p-4 h-64 flex items-center justify-start"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            >
              <div className="p-6 bg-white bg-opacity-75 rounded">
                <h2 className="text-3xl font-bold mb-2 slide-title">
                  {slide.title}
                </h2>
                <p className="mb-4 slide-desc">
                  {slide.description}
                </p>
                <button className="text-white bg-black hover:bg-opacity-50 px-4 py-2 rounded slide-button">
                  Shop Now
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
