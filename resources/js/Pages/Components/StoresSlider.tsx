import { useRef, useState } from "react";
import { Link } from "@inertiajs/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { FaStore, FaStar } from "react-icons/fa";
import { storeType } from "@/types";
import Eyebrow from "./Eyebrow";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";

/** A store plus the number of products it actually has on sale. */
type RailStore = storeType & { products_count?: number };

interface StoresSliderProps {
  stores: RailStore[];
}

const StoresSlider = ({ stores }: StoresSliderProps) => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);

  if (!stores || stores.length === 0) {
    return null;
  }

  return (
    <section id="stores">
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Eyebrow>Meet the sellers</Eyebrow>
            <h2 className="text-[30px] sm:text-[36px] lg:text-[44px]">Featured stores</h2>
            <p className="text-gray-500 mt-2">
              Browse the shops on HaatPoint and see everything they sell.
            </p>
          </div>

          <div className="hidden md:flex gap-2">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              disabled={isBeginning}
              className={`p-2 rounded-full border border-line transition-all duration-200 ${
                isBeginning
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-marigold hover:border-marigold hover:text-white"
              }`}
              aria-label="Previous stores"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              disabled={isEnd}
              className={`p-2 rounded-full border border-line transition-all duration-200 ${
                isEnd
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-marigold hover:border-marigold hover:text-white"
              }`}
              aria-label="Next stores"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={20}
          slidesPerView={1.2}
          breakpoints={{
            640: { slidesPerView: 2.2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 20 },
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={false}
          className="stores-swiper"
        >
          {stores.map((store) => {
            const name = store.name || "Store";
            // The stores table returns rating/review_count as strings, so these
            // must be coerced before any arithmetic is done on them.
            const rating = parseFloat(String(store.rating)) || 0;
            const reviewCount = parseInt(String(store.review_count), 10) || 0;
            const productCount = store.products_count ?? 0;

            return (
              <SwiperSlide key={store.id}>
                <Link
                  href={`/stores/${store.id}`}
                  className="block bg-white border border-line h-full hover:border-marigold hover:shadow-hard-sm transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0">
                        <div className="h-16 w-16 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500">
                          {store.logo ? (
                            <img
                              src={`/storage/${store.logo}`}
                              alt={name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
                              {name.charAt(0)}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-900 line-clamp-1 mb-1">
                          {name}
                        </h3>
                        <span className="inline-flex items-center px-2 py-1 text-xs border border-gray-300 rounded-md">
                          <FaStore className="h-3 w-3 mr-1" />
                          {store.storetype}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{rating.toFixed(1)}</span>
                      <span className="text-xs text-gray-400 ml-1">({reviewCount} reviews)</span>
                    </div>

                    <p className="text-sm text-text-soft line-clamp-2 flex-1">{store.address}</p>

                    <div className="mt-4 pt-4 border-t border-line flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {productCount} {productCount === 1 ? "product" : "products"}
                      </span>
                      <span className="text-marigold font-medium text-sm">Visit store →</span>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default StoresSlider;
