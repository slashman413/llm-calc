import InputPanel from './components/InputPanel';
import ResultPanel from './components/ResultPanel';
import AdPlaceholder from './components/AdPlaceholder';
import FAQ from './components/FAQ';
import LanguageSwitcher from './components/LanguageSwitcher';
import { LanguageProvider, useT } from './i18n/LanguageContext';
import { useCalculator } from './hooks/useCalculator';

function AppInner() {
  const { input, result, setParams, setQuant, setContext } = useCalculator();
  const { t } = useT();

  const [heroPre, heroPost] = t.heroTitle.split('{VRAM}');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">🖥️</span>
          <div className="flex-1 min-w-0">
            <span className="font-bold text-slate-100 text-sm sm:text-base">{t.siteTitle}</span>
            <span className="hidden sm:inline text-slate-500 text-sm ml-2">{t.siteSubtitle}</span>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mb-2">
            {heroPre}<span className="text-cyan-400">VRAM</span>{heroPost}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">{t.heroDesc}</p>
        </div>

        <AdPlaceholder id="ad-top" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <InputPanel
            paramsBillion={input.paramsBillion}
            quantization={input.quantization}
            contextKTokens={input.contextKTokens}
            onParams={setParams}
            onQuant={setQuant}
            onContext={setContext}
          />
          <ResultPanel result={result} />
        </div>

        <AdPlaceholder id="ad-bottom" />

        <FAQ />
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-slate-600 text-xs">
        {t.footer}
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppInner />
    </LanguageProvider>
  );
}
