import { type CalcResult, type HardwareRec } from '../utils/calculator';

interface Props {
  result: CalcResult;
}

function MemBar({ label, gb, color }: { label: string; gb: number; color: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className={`w-3 h-3 rounded-full flex-shrink-0 ${color}`} />
      <span className="text-slate-400 w-28 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-slate-700 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} opacity-70`}
          style={{ width: `${Math.min(100, (gb / Math.max(gb * 1.5, 4)) * 100)}%` }}
        />
      </div>
      <span className="text-slate-200 font-mono w-16 text-right">{gb.toFixed(2)} GB</span>
    </div>
  );
}

const VENDOR_BADGE: Record<HardwareRec['vendor'], { label: string; cls: string }> = {
  apple:  { label: '',      cls: 'bg-slate-700 text-slate-300' },
  nvidia: { label: 'NVIDIA', cls: 'bg-green-900/60 text-green-400 border border-green-800/50' },
  amd:    { label: 'AMD',    cls: 'bg-red-900/60 text-red-400 border border-red-800/50' },
  cpu:    { label: 'CPU',    cls: 'bg-slate-700 text-slate-400' },
};

const VENDOR_ORDER: HardwareRec['vendor'][] = ['apple', 'nvidia', 'amd', 'cpu'];
const VENDOR_TITLE: Record<HardwareRec['vendor'], string> = {
  apple:  '🍎  Apple',
  nvidia: '🟢  NVIDIA',
  amd:    '🔴  AMD',
  cpu:    '💾  CPU RAM',
};

function HwRow({ hw }: { hw: HardwareRec }) {
  const badge = VENDOR_BADGE[hw.vendor];
  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
        hw.fits
          ? 'bg-green-900/25 border border-green-800/40'
          : 'bg-slate-900/50 border border-slate-700/30 opacity-40'
      }`}
    >
      <span className={hw.fits ? 'text-green-400 font-bold' : 'text-red-600'}>
        {hw.fits ? '✓' : '✗'}
      </span>
      <span className={`flex-1 font-medium ${hw.fits ? 'text-slate-200' : 'text-slate-500'}`}>
        {/* strip vendor prefix from label to avoid duplication */}
        {hw.label.replace(/^(NVIDIA|AMD|Apple)\s+/i, '')}
      </span>
      {badge.label && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${badge.cls}`}>
          {badge.label}
        </span>
      )}
      <span className={`font-mono text-xs w-12 text-right ${hw.fits ? 'text-slate-400' : 'text-slate-600'}`}>
        {hw.vram} GB
      </span>
    </div>
  );
}

export default function ResultPanel({ result }: Props) {
  const { modelSizeGB, kvCacheGB, bufferGB, totalGB, recommendation } = result;

  const fitting = recommendation.filter((r) => r.fits);
  const lowestFit = fitting[0];

  const urgencyColor =
    totalGB <= 8  ? 'text-green-400' :
    totalGB <= 24 ? 'text-yellow-400' :
    totalGB <= 48 ? 'text-orange-400' : 'text-red-400';

  const byVendor = VENDOR_ORDER.map((v) => ({
    vendor: v,
    items: recommendation.filter((r) => r.vendor === v),
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* Total display */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 shadow-xl text-center">
        <p className="text-slate-400 text-sm uppercase tracking-widest mb-2">Total VRAM / RAM Required</p>
        <p className={`text-6xl font-extrabold tabular-nums ${urgencyColor}`}>
          {totalGB.toFixed(1)}
          <span className="text-3xl font-semibold ml-2 text-slate-300">GB</span>
        </p>
        {lowestFit && (
          <div className="mt-4 inline-flex items-center gap-2 bg-green-900/40 border border-green-700/50 rounded-lg px-4 py-2">
            <span className="text-green-400 text-sm">✓ Minimum:</span>
            <span className="text-green-300 text-sm font-semibold">{lowestFit.label}</span>
          </div>
        )}
      </div>

      {/* Breakdown */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Memory Breakdown</h3>
        <MemBar label="Model Weights" gb={modelSizeGB} color="bg-cyan-400" />
        <MemBar label="KV Cache"      gb={kvCacheGB}   color="bg-violet-400" />
        <MemBar label="Overhead"      gb={bufferGB}    color="bg-slate-400" />
        <div className="border-t border-slate-700 pt-3 flex justify-between text-sm font-semibold">
          <span className="text-slate-300">Total</span>
          <span className="text-white font-mono">{totalGB.toFixed(2)} GB</span>
        </div>
      </div>

      {/* Hardware compatibility — grouped by vendor */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Hardware Compatibility</h3>
        <div className="flex flex-col gap-4 max-h-[480px] overflow-y-auto pr-1">
          {byVendor.map(({ vendor, items }) => (
            <div key={vendor}>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                {VENDOR_TITLE[vendor]}
              </p>
              <div className="flex flex-col gap-1.5">
                {items.map((hw) => <HwRow key={hw.label} hw={hw} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
