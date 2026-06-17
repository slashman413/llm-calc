import { type Quantization, QUANT_OPTIONS, QUANT_LABELS } from '../utils/calculator';
import { useT } from '../i18n/LanguageContext';

interface Props {
  paramsBillion: number;
  quantization: Quantization;
  contextKTokens: number;
  onParams: (v: number) => void;
  onQuant: (v: Quantization) => void;
  onContext: (v: number) => void;
}

const PARAM_PRESETS = [1, 3, 7, 14, 32, 70, 72, 141, 405];
const CONTEXT_PRESETS_SMALL = [2, 4, 8, 16, 32, 64, 128];
const CONTEXT_PRESETS_LARGE = [256, 512, 1024, 2048];

const formatCtx = (n: number) =>
  n >= 1024 ? `${n / 1024}M` : `${n}K`;

export default function InputPanel({
  paramsBillion, quantization, contextKTokens,
  onParams, onQuant, onContext,
}: Props) {
  const { t } = useT();

  return (
    <div className="flex flex-col gap-8 bg-slate-800/60 border border-slate-700 rounded-2xl p-6 shadow-xl">
      <h2 className="text-lg font-semibold text-slate-200 tracking-wide uppercase">
        {t.inputTitle}
      </h2>

      {/* Parameters */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-baseline">
          <label className="text-sm font-medium text-slate-300">{t.params}</label>
          <span className="text-2xl font-bold text-cyan-400 tabular-nums">{paramsBillion}B</span>
        </div>
        <input
          type="range"
          min={1} max={405} step={1}
          value={paramsBillion}
          onChange={(e) => onParams(Number(e.target.value))}
          className="w-full h-2 rounded-full bg-slate-700 accent-cyan-400 cursor-pointer"
        />
        <div className="flex flex-wrap gap-2 mt-1">
          {PARAM_PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => onParams(p)}
              className={`px-3 py-1 rounded-md text-xs font-mono font-semibold transition-colors ${
                paramsBillion === p
                  ? 'bg-cyan-500 text-slate-900'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {p}B
            </button>
          ))}
        </div>
      </div>

      {/* Quantization */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-slate-300">{t.quant}</label>
        <select
          value={quantization}
          onChange={(e) => onQuant(e.target.value as Quantization)}
          className="w-full rounded-lg border border-slate-600 bg-slate-900 text-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
        >
          {QUANT_OPTIONS.map((q) => (
            <option key={q} value={q}>{QUANT_LABELS[q]}</option>
          ))}
        </select>
        <p className="text-xs text-slate-500">{t.quantHint}</p>
      </div>

      {/* Context Window */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-baseline">
          <label className="text-sm font-medium text-slate-300">{t.contextLabel}</label>
          <span className="text-2xl font-bold text-violet-400 tabular-nums">{formatCtx(contextKTokens)}</span>
        </div>
        <input
          type="range"
          min={2} max={2048} step={4}
          value={contextKTokens}
          onChange={(e) => onContext(Number(e.target.value))}
          className="w-full h-2 rounded-full bg-slate-700 accent-violet-400 cursor-pointer"
        />
        <div className="flex flex-wrap gap-2 mt-1">
          {CONTEXT_PRESETS_SMALL.map((c) => (
            <button
              key={c}
              onClick={() => onContext(c)}
              className={`px-3 py-1 rounded-md text-xs font-mono font-semibold transition-colors ${
                contextKTokens === c
                  ? 'bg-violet-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {formatCtx(c)}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {CONTEXT_PRESETS_LARGE.map((c) => (
            <button
              key={c}
              onClick={() => onContext(c)}
              className={`px-3 py-1 rounded-md text-xs font-mono font-semibold transition-colors ${
                contextKTokens === c
                  ? 'bg-fuchsia-500 text-white'
                  : 'bg-slate-700/80 text-fuchsia-300 hover:bg-slate-600'
              }`}
            >
              {formatCtx(c)}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500">{t.contextHint}</p>
      </div>
    </div>
  );
}
