import { jsx } from "react/jsx-runtime";
import { u as useTranslation } from "./languageStore-DF0bQFKG.js";
import "zustand";
import "zustand/middleware";
const FormatPrice = ({ price, currency = "BDT" }) => {
  const { language } = useTranslation();
  const formatPrice = (amount) => {
    const locale = language === "bn" ? "bn-BD" : "en-US";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  return /* @__PURE__ */ jsx("span", { children: formatPrice(price) });
};
export {
  FormatPrice as default
};
