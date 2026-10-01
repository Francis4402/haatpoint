import { useMemo, useRef, useState, type ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Eyebrow from "./Eyebrow";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

/** How many items make up one full page of the showcase. */
const PER_PAGE = 3;

export interface ProductShowcaseProps<T> {
  /** Items to page through. The route layer caps this at six. */
  items: T[];
  /** Stable id used for the section anchor. */
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  /** Rendered once above the slides, e.g. column headings. */
  slideHeader?: ReactNode;
  /** Renders a single item. */
  renderItem: (item: T, index: number) => ReactNode;
  /** Tints the pagination bullets and arrows. */
  accent?: boolean;
}

function ProductShowcase<T>({
  items,
  id,
  eyebrow,
  title,
  description,
  slideHeader,
  renderItem,
  accent = false,
}: ProductShowcaseProps<T>) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // Chunk the items into pages. A single page means there is nothing to
  // crossfade to, so the slider renders as a plain grid in that case.
  const pages = useMemo(() => {
    const chunks: T[][] = [];

    for (let i = 0; i < items.length; i += PER_PAGE) {
      chunks.push(items.slice(i, i + PER_PAGE));
    }

    return chunks;
  }, [items]);

  const total = items.length;

  if (total === 0) {
    return null;
  }

  const isSinglePage = pages.length < 2;

  return (
    <section id={id}>
      <div>
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="text-[30px] sm:text-[36px] lg:text-[44px]">{title}</h2>
            {description && <p className="text-gray-500 mt-2">{description}</p>}
          </div>

          {!isSinglePage && (
            <div className="hidden md:flex gap-2 shrink-0">
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                disabled={isBeginning}
                className={`p-2 rounded-full border border-line transition-all duration-200 ${
                  isBeginning
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-marigold hover:border-marigold hover:text-white"
                }`}
                aria-label={`Previous ${title.toLowerCase()}`}
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
                aria-label={`Next ${title.toLowerCase()}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {isSinglePage ? (
          <div className="space-y-3">
            {slideHeader}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, index) => (
                <div key={index}>{renderItem(item, index)}</div>
              ))}
            </div>
          </div>
        ) : (
          <Swiper
            modules={[EffectFade, Autoplay, Navigation, Pagination, A11y]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            speed={650}
            spaceBetween={0}
            slidesPerView={1}
            loop
            watchSlidesProgress
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              el: `.showcase-pagination-${id}`,
            }}
            a11y={{ enabled: true }}
            className="product-showcase"
          >
            {pages.map((page, pageIndex) => (
              <SwiperSlide key={pageIndex}>
                <div className="space-y-3">
                  {slideHeader}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {page.map((item, itemIndex) => (
                      <div key={itemIndex}>{renderItem(item, pageIndex * PER_PAGE + itemIndex)}</div>
                    ))}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {!isSinglePage && (
          <div className={`mt-8 showcase-pagination-${id} swiper-pagination`} />
        )}

        {accent && (
          <p className="text-xs font-mono text-text-soft mt-4">
            {total} {total === 1 ? "product" : "products"}
          </p>
        )}
      </div>
    </section>
  );
}

export default ProductShowcase;
