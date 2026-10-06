import { jsx, jsxs } from "react/jsx-runtime";
import { FaWhatsapp } from "react-icons/fa";
const WHATSAPP_NUMBER = "8801319052507";
const WHATSAPP_NAME = "HaatPoint";
const DEFAULT_MESSAGE = `Hi ${WHATSAPP_NAME}! I have a question about your store.`;
function WhatsAppChatButton({ message = DEFAULT_MESSAGE }) {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  return /* @__PURE__ */ jsx("div", { className: "fixed bottom-5 right-5 z-[120] sm:bottom-6 sm:right-6", children: /* @__PURE__ */ jsxs(
    "a",
    {
      href,
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": `Chat with ${WHATSAPP_NAME} on WhatsApp`,
      className: "group flex items-center gap-3 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2",
      children: [
        /* @__PURE__ */ jsxs("span", { className: "hidden max-w-0 overflow-hidden whitespace-nowrap rounded-full bg-white px-0 py-2 text-sm font-semibold text-ink opacity-0 shadow-hard-sm transition-all duration-300 group-hover:max-w-[14rem] group-hover:px-4 group-hover:opacity-100 group-focus-visible:max-w-[14rem] group-focus-visible:px-4 group-focus-visible:opacity-100 sm:block sm:max-w-[14rem] sm:px-4 sm:opacity-100", children: [
          "Chat with ",
          WHATSAPP_NAME
        ] }),
        /* @__PURE__ */ jsx("span", { className: "flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-hard-sm transition-transform duration-300 group-hover:scale-110 group-active:scale-95", children: /* @__PURE__ */ jsx(FaWhatsapp, { className: "h-7 w-7", "aria-hidden": "true" }) })
      ]
    }
  ) });
}
export {
  WhatsAppChatButton as W
};
