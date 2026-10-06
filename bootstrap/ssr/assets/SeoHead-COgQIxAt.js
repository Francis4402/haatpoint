import { jsxs, jsx } from "react/jsx-runtime";
import Navbar from "./Navbar-I09bUsbF.js";
import { W as WhatsAppChatButton } from "./WhatsAppChatButton-CDSWQr0H.js";
import { Head } from "@inertiajs/react";
function AppLayout({ user, children, wishlist }) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(Navbar, { user, wishlist }),
    /* @__PURE__ */ jsx("main", { className: "flex-1", children }),
    /* @__PURE__ */ jsx(WhatsAppChatButton, {})
  ] });
}
const SITE_URL = "https://www.haatpoint.com";
const SITE_NAME = "HaatPoint";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
const DEFAULT_TWITTER_IMAGE = `${SITE_URL}/summary_large_image.jpg`;
function SeoHead({
  title,
  description = "Shop thousands of products from trusted vendors across Bangladesh. Find electronics, fashion, home goods & more at HaatPoint.",
  keywords,
  canonical = SITE_URL,
  robots = "index, follow",
  ogType = "website",
  ogTitle,
  ogDescription,
  ogImage = DEFAULT_OG_IMAGE,
  twitterTitle,
  twitterDescription,
  twitterImage,
  ogUrl,
  jsonLd,
  children
}) {
  const resolveImage = (image) => image.startsWith("http") ? image : `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`;
  const resolvedOgImage = resolveImage(ogImage);
  const resolvedTwitterImage = twitterImage ? resolveImage(twitterImage) : DEFAULT_TWITTER_IMAGE;
  const resolvedOgUrl = ogUrl || canonical;
  const finalOgTitle = ogTitle || title;
  const finalOgDescription = ogDescription || description;
  const finalTwitterTitle = twitterTitle || finalOgTitle;
  const finalTwitterDescription = twitterDescription || finalOgDescription;
  const renderJsonLd = (data) => {
    if (!data) return null;
    const list = Array.isArray(data) ? data : [data];
    return list.map((schema, index) => /* @__PURE__ */ jsx(
      "script",
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: { __html: JSON.stringify(schema) }
      },
      index
    ));
  };
  return /* @__PURE__ */ jsxs(Head, { children: [
    /* @__PURE__ */ jsx("title", { children: title }),
    /* @__PURE__ */ jsx("meta", { name: "description", content: description }),
    keywords ? /* @__PURE__ */ jsx("meta", { name: "keywords", content: keywords }) : null,
    /* @__PURE__ */ jsx("meta", { name: "robots", content: robots }),
    /* @__PURE__ */ jsx("link", { rel: "canonical", href: canonical }),
    /* @__PURE__ */ jsx("link", { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }),
    /* @__PURE__ */ jsx("link", { rel: "manifest", href: "/site.webmanifest" }),
    /* @__PURE__ */ jsx("meta", { property: "og:type", content: ogType }),
    /* @__PURE__ */ jsx("meta", { property: "og:title", content: finalOgTitle }),
    /* @__PURE__ */ jsx("meta", { property: "og:description", content: finalOgDescription }),
    /* @__PURE__ */ jsx("meta", { property: "og:url", content: resolvedOgUrl }),
    /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: SITE_NAME }),
    /* @__PURE__ */ jsx("meta", { property: "og:image", content: resolvedOgImage }),
    /* @__PURE__ */ jsx("meta", { property: "og:image:width", content: "1200" }),
    /* @__PURE__ */ jsx("meta", { property: "og:image:height", content: "630" }),
    /* @__PURE__ */ jsx("meta", { property: "og:locale", content: "en_US" }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: finalTwitterTitle }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: finalTwitterDescription }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: resolvedTwitterImage }),
    renderJsonLd(jsonLd),
    children
  ] });
}
export {
  AppLayout as A,
  SeoHead as S
};
