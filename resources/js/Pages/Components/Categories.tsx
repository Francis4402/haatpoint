import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { useRef, useState } from "react";
import type { Swiper as SwiperType } from 'swiper';
import { categoryType } from '@/types';
import Eyebrow from './Eyebrow';


import 'swiper/css';
import 'swiper/css/autoplay';

const Categories = ({ categories }: { categories: categoryType[] }) => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section id="categories">
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Eyebrow>Browse the haat</Eyebrow>
            <h2 className="text-[30px] sm:text-[36px] lg:text-[44px]">Shop by category</h2>
          </div>

          {/* Navigation Buttons */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              disabled={isBeginning}
              className={`p-2 rounded-full border border-line transition-all duration-200 ${
                isBeginning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-marigold hover:border-marigold hover:text-white'
              }`}
              aria-label="Previous"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              disabled={isEnd}
              className={`p-2 rounded-full border border-line transition-all duration-200 ${
                isEnd ? 'opacity-50 cursor-not-allowed' : 'hover:bg-marigold hover:border-marigold hover:text-white'
              }`}
              aria-label="Next"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={14}
          slidesPerView={2}
          breakpoints={{
            640: {
              slidesPerView: 3,
              spaceBetween: 14,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 14,
            },
            1024: {
              slidesPerView: 6,
              spaceBetween: 14,
            },
            1280: {
              slidesPerView: 8,
              spaceBetween: 14,
            },
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: true,
            pauseOnMouseEnter: true,
          }}
          loop={false}
          className="categories-swiper"
        >
          {categories.map((c) => (
            <SwiperSlide key={c.id}>
              <div
                className="clip-cat group flex flex-col items-center gap-2.5 text-center px-3.5 py-5 cursor-pointer bg-white border border-line transition-all duration-200 hover:border-marigold hover:-translate-y-1 hover:shadow-hard-sm h-full"
              >
                <div className="text-xl transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3">
                  <LazyLoadImage
                    src={`/storage/${c.image}`}
                    alt={c.categories}
                    effect="blur"
                    placeholderSrc="/otherplaceholder.jpg"
                    threshold={100}
                    className="w-25 h-25 object-contain"
                  />
                </div>
                <span className="text-xs font-bold leading-tight">{c.categories}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Mobile Pagination Dots */}
        <div className="flex justify-center mt-6 md:hidden">
          <div className="flex gap-2">
            {categories.map((_, index) => (
              <button
                key={index}
                className="w-2 h-2 rounded-full bg-gray-300 transition-all duration-200 hover:bg-marigold"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => swiperRef.current?.slideTo(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
