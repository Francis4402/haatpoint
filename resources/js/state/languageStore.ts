import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'bn';

const getInitialLanguage = (): Language => {
  if (typeof document === 'undefined') return 'en';
  const cookieMatch = document.cookie.match(/googtrans=\/[^/]+\/([^;]+)/);
  if (cookieMatch && cookieMatch[1] === 'bn') return 'bn';
  try {
    const saved = localStorage.getItem('haatpoint_language');
    if (saved && saved.includes('"bn"')) return 'bn';
  } catch {}
  return 'en';
};

const applyGoogleTranslate = (lang: Language) => {
  if (typeof document === 'undefined') return;

  const cookieVal = lang === 'en' ? '/en/en' : '/en/bn';
  const hostname = window.location.hostname;

  // Clear existing googtrans cookie
  document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${hostname}; path=/;`;

  // Set new cookie across root and host
  document.cookie = `googtrans=${cookieVal}; path=/;`;
  document.cookie = `googtrans=${cookieVal}; domain=${hostname}; path=/;`;

  const domainParts = hostname.split('.');
  if (domainParts.length > 1) {
    const rootDomain = '.' + domainParts.slice(-2).join('.');
    document.cookie = `googtrans=${cookieVal}; domain=${rootDomain}; path=/;`;
  }

  document.documentElement.lang = lang;

  // Trigger Google Translate select element if it's already rendered in the DOM
  const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event('change'));
  } else {
    // If Google Translate element is still initializing, reload so it reads the googtrans cookie on boot
    window.location.reload();
  }
};

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: getInitialLanguage(),
      setLanguage: (lang: Language) => {
        applyGoogleTranslate(lang);
        set({ language: lang });
      },
      toggleLanguage: () => {
        const nextLang: Language = get().language === 'en' ? 'bn' : 'en';
        applyGoogleTranslate(nextLang);
        set({ language: nextLang });
      },
    }),
    {
      name: 'haatpoint_language',
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== 'undefined') {
          const cookieMatch = document.cookie.match(/googtrans=\/[^/]+\/([^;]+)/);
          if (state.language === 'bn' && (!cookieMatch || cookieMatch[1] !== 'bn')) {
            applyGoogleTranslate('bn');
          }
        }
      },
    }
  )
);

export const useTranslation = () => {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const toggleLanguage = useLanguageStore((state) => state.toggleLanguage);

  return {
    language,
    setLanguage,
    toggleLanguage,
    isBn: language === 'bn',
    isEn: language === 'en',
    t: (_key: string, defaultText?: string) => defaultText || _key,
  };
};

export default useTranslation;
