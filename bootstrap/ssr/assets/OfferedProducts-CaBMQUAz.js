import { jsx } from "react/jsx-runtime";
import { P as ProductCard } from "./ProductCard-Cpjc5ymN.js";
import ProductShowcase from "./ProductShowcase-BYMwkQb2.js";
import "react";
import "@inertiajs/react";
import "react-icons/fa";
import "react-icons/fi";
import "axios";
import "./AddtoCartButton-CZxthnYv.js";
import "sonner";
import "./cartStore-BOd_ZlZA.js";
import "zustand";
import "zustand/middleware";
import "./languageStore-DF0bQFKG.js";
import "./FormatePrice-CMWyewFT.js";
import "react-lazy-load-image-component";
import "./WishListButton-DoaUgqlu.js";
import "swiper/react";
import "swiper/modules";
import "./Eyebrow-BL4QDtth.js";
/* empty css                */
/* empty css                    */
const OfferedProducts = ({ product, user }) => {
  const products = (product ?? []).map((item) => ({
    ...item,
    rating: typeof item.rating === "string" ? parseFloat(item.rating) : Number(item.rating) || 0
  }));
  return /* @__PURE__ */ jsx(
    ProductShowcase,
    {
      id: "offers",
      eyebrow: "Hand-picked for you",
      title: "Products on offer",
      description: "A rotating selection of deals, refreshed on every visit.",
      items: products,
      renderItem: (item) => /* @__PURE__ */ jsx(ProductCard, { product: item, user, variant: "featured" })
    }
  );
};
export {
  OfferedProducts as default
};
