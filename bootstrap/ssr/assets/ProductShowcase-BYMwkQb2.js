import { jsx, jsxs } from "react/jsx-runtime";
import { useRef, useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation, Pagination, A11y } from "swiper/modules";
import Eyebrow from "./Eyebrow-BL4QDtth.js";
/* empty css                */
/* empty css                    */
const PER_PAGE = 3;
function ProductShowcase({
  items,
  id,
  eyebrow,
  title,
  description,
  slideHeader,
  renderItem,
  accent = false
}) {
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const pages = useMemo(() => {
    const chunks = [];
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
  return /* @__PURE__ */ jsx("section", { id, children: /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8 flex items-end justify-between gap-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Eyebrow, { children: eyebrow }),
        /* @__PURE__ */ jsx("h2", { className: "text-[30px] sm:text-[36px] lg:text-[44px]", children: title }),
        description && /* @__PURE__ */ jsx("p", { className: "text-gray-500 mt-2", children: description })
      ] }),
      !isSinglePage && /* @__PURE__ */ jsxs("div", { className: "hidden md:flex gap-2 shrink-0", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => swiperRef.current?.slidePrev(),
            disabled: isBeginning,
            className: `p-2 rounded-full border border-line transition-all duration-200 ${isBeginning ? "opacity-50 cursor-not-allowed" : "hover:bg-marigold hover:border-marigold hover:text-white"}`,
            "aria-label": `Previous ${title.toLowerCase()}`,
            children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => swiperRef.current?.slideNext(),
            disabled: isEnd,
            className: `p-2 rounded-full border border-line transition-all duration-200 ${isEnd ? "opacity-50 cursor-not-allowed" : "hover:bg-marigold hover:border-marigold hover:text-white"}`,
            "aria-label": `Next ${title.toLowerCase()}`,
            children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })
          }
        )
      ] })
    ] }),
    isSinglePage ? /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      slideHeader,
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: items.map((item, index) => /* @__PURE__ */ jsx("div", { children: renderItem(item, index) }, index)) })
    ] }) : /* @__PURE__ */ jsx(
      Swiper,
      {
        modules: [EffectFade, Autoplay, Navigation, Pagination, A11y],
        effect: "fade",
        fadeEffect: { crossFade: true },
        speed: 650,
        spaceBetween: 0,
        slidesPerView: 1,
        loop: true,
        watchSlidesProgress: true,
        onSwiper: (swiper) => {
          swiperRef.current = swiper;
        },
        onSlideChange: (swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        },
        autoplay: {
          delay: 4e3,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        },
        pagination: {
          clickable: true,
          el: `.showcase-pagination-${id}`
        },
        a11y: { enabled: true },
        className: "product-showcase",
        children: pages.map((page, pageIndex) => /* @__PURE__ */ jsx(SwiperSlide, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          slideHeader,
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: page.map((item, itemIndex) => /* @__PURE__ */ jsx("div", { children: renderItem(item, pageIndex * PER_PAGE + itemIndex) }, itemIndex)) })
        ] }) }, pageIndex))
      }
    ),
    !isSinglePage && /* @__PURE__ */ jsx("div", { className: `mt-8 showcase-pagination-${id} swiper-pagination` }),
    accent && /* @__PURE__ */ jsxs("p", { className: "text-xs font-mono text-text-soft mt-4", children: [
      total,
      " ",
      total === 1 ? "product" : "products"
    ] })
  ] }) });
}
export {
  ProductShowcase as default
};
