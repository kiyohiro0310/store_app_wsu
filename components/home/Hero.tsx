import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";

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

  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      spaceBetween={30}
      slidesPerView={1}
      loop={true}
      autoplay={{ delay: 5000 }}
      pagination={{ clickable: true }}
      className="h-64"
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
              <h2 className="text-3xl font-bold mb-2">{slide.title}</h2>
              <p className="mb-4">{slide.description}</p>
              <button className="text-white bg-black hover:bg-opacity-50 px-4 py-2 rounded">
                Shop Now
              </button>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
