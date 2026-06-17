import { useState } from 'react';
import { useT } from '../i18n/LanguageContext';
import { LANGUAGES, type LangCode } from '../i18n/translations';

export default function LanguageSwitcher() {
  const { lang, setLang } = useT();
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 border border-slate-600 text-slate-200 text-sm transition-colors select-none"
        aria-label="Switch language"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline text-xs font-medium">{current.name}</span>
        <span className="text-slate-400 text-[10px]">▾</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 bg-slate-800 border border-slate-600 rounded-xl shadow-xl py-1 w-48 max-h-80 overflow-y-auto">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code as LangCode); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors ${
                  l.code === lang
                    ? 'text-cyan-400 bg-slate-700/50 font-medium'
                    : 'text-slate-300 hover:bg-slate-700/40'
                }`}
              >
                <span className="text-base">{l.flag}</span>
                <span>{l.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
