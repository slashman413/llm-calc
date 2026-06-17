import { type Quantization, QUANT_OPTIONS, QUANT_LABELS } from '../utils/calculator';

interface Props {
  paramsBillion: number;
  quantization: Quantization;
  contextKTokens: number;
  onParams: (v: number) => void;
  onQuant: (v: Quantization) => void;
  onContext: (v: number) => void;
}

const PARAM_PRESETS = [1, 3, 7, 14, 32, 70, 72, 141, 405];
const CONTEXT_PRESETS = [2, 4, 8, 16, 32, 64, 128];

export default function InputPanel({
  paramsBillion, quantization, contextKTokens,
  onParams, onQuant, onContext,
}: Props) {
  return (
    <div className="flex flex-col gap-8 bg-slate-800/60 border border-slate-700 rounded-2xl p-6 shadow-xl">
      <h2 className="text-lg font-semibold text-slate-200 tracking-wide uppercase">
        ⚙️ Model Configuration
      </h2>

      {/* Parameters */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-baseline">
          <label className="text-sm font-medium text-slate-300">Parameters</label>
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
        <label className="text-sm font-medium text-slate-300">Quantization Format</label>
        <select
          value={quantization}
          onChange={(e) => onQuant(e.target.value as Quantization)}
          className="w-full rounded-lg border border-slate-600 bg-slate-900 text-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
        >
          {QUANT_OPTIONS.map((q) => (
            <option key={q} value={q}>{QUANT_LABELS[q]}</option>
          ))}
        </select>
        <p className="text-xs text-slate-500">
          Q4_K_M is the sweet spot — best quality-to-size ratio for most use cases.
        </p>
      </div>

      {/* Context Window */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-baseline">
          <label className="text-sm font-medium text-slate-300">Context Window</label>
          <span className="text-2xl font-bold text-violet-400 tabular-nums">{contextKTokens}K</span>
        </div>
        <input
          type="range"
          min={2} max={128} step={2}
          value={contextKTokens}
          onChange={(e) => onContext(Number(e.target.value))}
          className="w-full h-2 rounded-full bg-slate-700 accent-violet-400 cursor-pointer"
        />
        <div className="flex flex-wrap gap-2 mt-1">
          {CONTEXT_PRESETS.map((c) => (
            <button
              key={c}
              onClick={() => onContext(c)}
              className={`px-3 py-1 rounded-md text-xs font-mono font-semibold transition-colors ${
                contextKTokens === c
                  ? 'bg-violet-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {c}K
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500">
          Longer contexts consume significantly more VRAM for the KV cache.
        </p>
      </div>
    </div>
  );
}
