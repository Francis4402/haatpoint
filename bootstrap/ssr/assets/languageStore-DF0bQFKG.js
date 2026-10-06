import { create } from "zustand";
import { persist } from "zustand/middleware";
const getInitialLanguage = () => {
  if (typeof document === "undefined") return "en";
  const cookieMatch = document.cookie.match(/googtrans=\/[^/]+\/([^;]+)/);
  if (cookieMatch && cookieMatch[1] === "bn") return "bn";
  try {
    const saved = localStorage.getItem("haatpoint_language");
    if (saved && saved.includes('"bn"')) return "bn";
  } catch {
  }
  return "en";
};
const applyGoogleTranslate = (lang) => {
  if (typeof document === "undefined") return;
  const cookieVal = lang === "en" ? "/en/en" : "/en/bn";
  const hostname = window.location.hostname;
  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${hostname}; path=/;`;
  document.cookie = `googtrans=${cookieVal}; path=/;`;
  document.cookie = `googtrans=${cookieVal}; domain=${hostname}; path=/;`;
  const domainParts = hostname.split(".");
  if (domainParts.length > 1) {
    const rootDomain = "." + domainParts.slice(-2).join(".");
    document.cookie = `googtrans=${cookieVal}; domain=${rootDomain}; path=/;`;
  }
  document.documentElement.lang = lang;
  const select = document.querySelector(".goog-te-combo");
  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event("change"));
  } else {
    window.location.reload();
  }
};
const useLanguageStore = create()(
  persist(
    (set, get) => ({
      language: getInitialLanguage(),
      setLanguage: (lang) => {
        applyGoogleTranslate(lang);
        set({ language: lang });
      },
      toggleLanguage: () => {
        const nextLang = get().language === "en" ? "bn" : "en";
        applyGoogleTranslate(nextLang);
        set({ language: nextLang });
      }
    }),
    {
      name: "haatpoint_language",
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== "undefined") {
          const cookieMatch = document.cookie.match(/googtrans=\/[^/]+\/([^;]+)/);
          if (state.language === "bn" && (!cookieMatch || cookieMatch[1] !== "bn")) {
            applyGoogleTranslate("bn");
          }
        }
      }
    }
  )
);
const useTranslation = () => {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const toggleLanguage = useLanguageStore((state) => state.toggleLanguage);
  return {
    language,
    setLanguage,
    toggleLanguage,
    isBn: language === "bn",
    isEn: language === "en",
    t: (_key, defaultText) => defaultText || _key
  };
};
export {
  useTranslation as u
};
