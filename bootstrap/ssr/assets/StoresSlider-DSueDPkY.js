import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { Link } from "@inertiajs/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { FaStore, FaStar } from "react-icons/fa";
import Eyebrow from "./Eyebrow-BL4QDtth.js";
/* empty css                */
/* empty css                  */
/* empty css                    */
const StoresSlider = ({ stores }) => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef(null);
  if (!stores || stores.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsx("section", { id: "stores", children: /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Eyebrow, { children: "Meet the sellers" }),
        /* @__PURE__ */ jsx("h2", { className: "text-[30px] sm:text-[36px] lg:text-[44px]", children: "Featured stores" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 mt-2", children: "Browse the shops on HaatPoint and see everything they sell." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "hidden md:flex gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => swiperRef.current?.slidePrev(),
            disabled: isBeginning,
            className: `p-2 rounded-full border border-line transition-all duration-200 ${isBeginning ? "opacity-50 cursor-not-allowed" : "hover:bg-marigold hover:border-marigold hover:text-white"}`,
            "aria-label": "Previous stores",
            children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => swiperRef.current?.slideNext(),
            disabled: isEnd,
            className: `p-2 rounded-full border border-line transition-all duration-200 ${isEnd ? "opacity-50 cursor-not-allowed" : "hover:bg-marigold hover:border-marigold hover:text-white"}`,
            "aria-label": "Next stores",
            children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      Swiper,
      {
        modules: [Autoplay, Navigation],
        spaceBetween: 20,
        slidesPerView: 1.2,
        breakpoints: {
          640: { slidesPerView: 2.2, spaceBetween: 20 },
          768: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 20 }
        },
        onSwiper: (swiper) => {
          swiperRef.current = swiper;
        },
        onSlideChange: (swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        },
        autoplay: {
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        },
        loop: false,
        className: "stores-swiper",
        children: stores.map((store) => {
          const name = store.name || "Store";
          const rating = parseFloat(String(store.rating)) || 0;
          const reviewCount = parseInt(String(store.review_count), 10) || 0;
          const productCount = store.products_count ?? 0;
          return /* @__PURE__ */ jsx(SwiperSlide, { children: /* @__PURE__ */ jsx(
            Link,
            {
              href: `/stores/${store.id}`,
              className: "block bg-white border border-line h-full hover:border-marigold hover:shadow-hard-sm transition-all duration-300 hover:-translate-y-1",
              children: /* @__PURE__ */ jsxs("div", { className: "p-6 h-full flex flex-col", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 mb-4", children: [
                  /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: "h-16 w-16 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500", children: store.logo ? /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: `/storage/${store.logo}`,
                      alt: name,
                      className: "w-full h-full object-cover",
                      onError: (e) => {
                        e.target.style.display = "none";
                      }
                    }
                  ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center text-white text-xl font-bold", children: name.charAt(0) }) }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg text-gray-900 line-clamp-1 mb-1", children: name }),
                    /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-2 py-1 text-xs border border-gray-300 rounded-md", children: [
                      /* @__PURE__ */ jsx(FaStore, { className: "h-3 w-3 mr-1" }),
                      store.storetype
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 mb-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "flex", children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsx(
                    FaStar,
                    {
                      className: `h-3.5 w-3.5 ${i < Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"}`
                    },
                    i
                  )) }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-gray-900", children: rating.toFixed(1) }),
                  /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-400 ml-1", children: [
                    "(",
                    reviewCount,
                    " reviews)"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-text-soft line-clamp-2 flex-1", children: store.address }),
                /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-line flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-gray-700", children: [
                    productCount,
                    " ",
                    productCount === 1 ? "product" : "products"
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-marigold font-medium text-sm", children: "Visit store →" })
                ] })
              ] })
            }
          ) }, store.id);
        })
      }
    )
  ] }) });
};
export {
  StoresSlider as default
};
