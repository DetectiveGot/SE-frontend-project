"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";

import Link from "next/link";
import Card from "@/components/ui/Card";

export default function MySwiper({ restaurants,ratingMap }: any) {
  return (
    <Swiper
      modules={[FreeMode, Autoplay]}
      slidesPerView="auto"
      spaceBetween={30}
      freeMode={true}
      grabCursor={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      speed={800}
      loop={true}
      className="h-70 pt-5 !overflow-visible"
    >
      {restaurants.map((it: any) => (
        <SwiperSlide key={it._id} className="!w-auto !overflow-visible">
          <Link href={`/restaurants/${it._id}`}>
            <Card restaurant={it} ratingMap={ratingMap} />
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}