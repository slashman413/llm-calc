import InputPanel from './components/InputPanel';
import ResultPanel from './components/ResultPanel';
import AdPlaceholder from './components/AdPlaceholder';
import FAQ from './components/FAQ';
import { useCalculator } from './hooks/useCalculator';

export default function App() {
  const { input, result, setParams, setQuant, setContext } = useCalculator();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">🖥️</span>
          <div>
            <span className="font-bold text-slate-100 text-sm sm:text-base">Local LLM VRAM Calculator</span>
            <span className="hidden sm:inline text-slate-500 text-sm ml-2">for GGUF & AWQ</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-6">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mb-2">
            How much <span className="text-cyan-400">VRAM</span> do I need?
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Estimate memory requirements for running local LLMs — supports GGUF, AWQ, FP16 and more.
            Results update instantly.
          </p>
        </div>

        {/* Top Ad */}
        <AdPlaceholder id="ad-top" />

        {/* Main layout: input left, result right */}
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

        {/* Bottom Ad */}
        <AdPlaceholder id="ad-bottom" />

        {/* FAQ */}
        <FAQ />
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-slate-600 text-xs">
        Estimates are approximate. Actual VRAM usage varies by framework, batch size, and model architecture.
      </footer>
    </div>
  );
}
