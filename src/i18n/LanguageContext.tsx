import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { TRANSLATIONS, type Translations, type LangCode } from './translations';

interface LangCtxType {
  lang: LangCode;
  t: Translations;
  setLang: (l: LangCode) => void;
}

const LangCtx = createContext<LangCtxType | null>(null);

function detectLang(): LangCode {
  try {
    const saved = localStorage.getItem('llm-calc-lang') as LangCode;
    if (saved && saved in TRANSLATIONS) return saved;
    const browser = navigator.language.split('-')[0] as LangCode;
    if (browser in TRANSLATIONS) return browser;
  } catch {}
  return 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(detectLang);

  const setLang = (l: LangCode) => {
    setLangState(l);
    try { localStorage.setItem('llm-calc-lang', l); } catch {}
  };

  const t = TRANSLATIONS[lang] ?? TRANSLATIONS['en'];

  useEffect(() => {
    document.documentElement.dir = t.rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, t.rtl]);

  return <LangCtx.Provider value={{ lang, t, setLang }}>{children}</LangCtx.Provider>;
}

export function useT() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error('useT must be inside LanguageProvider');
  return ctx;
}
