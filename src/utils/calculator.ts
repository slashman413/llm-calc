export type Quantization = 'FP16' | 'Q8_0' | 'Q6_K' | 'Q5_K_M' | 'Q4_K_M' | 'Q3_K_M' | 'AWQ';

export interface CalcInput {
  paramsBillion: number;   // e.g. 7, 14, 70
  quantization: Quantization;
  contextKTokens: number;  // e.g. 4, 8, 32, 128
}

export interface CalcResult {
  modelSizeGB: number;
  kvCacheGB: number;
  bufferGB: number;
  totalGB: number;
  recommendation: HardwareRec[];
}

export interface HardwareRec {
  label: string;
  fits: boolean;
  vram: number;
  note: string;
  vendor: 'apple' | 'nvidia' | 'amd' | 'cpu';
}

// Bytes per weight for each quantization
const BYTES_PER_WEIGHT: Record<Quantization, number> = {
  FP16:   2.0,
  Q8_0:   1.0,
  Q6_K:   0.75,
  Q5_K_M: 0.625,
  Q4_K_M: 0.5,
  Q3_K_M: 0.375,
  AWQ:    0.5,   // 4-bit AWQ ≈ same as Q4
};

// KV cache bytes per token per layer (fp16 key + value, 2 heads combined)
// Each token needs 2 * num_heads * head_dim * num_layers bytes for KV cache
// Approximation: ~0.125 MB per 1K tokens per billion params (heuristic)
const KV_MB_PER_K_TOKEN_PER_B_PARAM = 0.125;

const HARDWARE: Array<{ label: string; vram: number; note: string; vendor: 'apple' | 'nvidia' | 'amd' | 'cpu' }> = [
  // Apple
  { label: 'Apple M-series 8 GB',             vram: 8,   note: 'Unified memory (shared CPU+GPU)',      vendor: 'apple'  },
  { label: 'Apple M-series 16 GB',            vram: 16,  note: 'Unified memory (shared CPU+GPU)',      vendor: 'apple'  },
  { label: 'Apple M-series 32 GB',            vram: 32,  note: 'Unified memory (shared CPU+GPU)',      vendor: 'apple'  },
  { label: 'Apple M-series 64 GB',            vram: 64,  note: 'Unified memory (shared CPU+GPU)',      vendor: 'apple'  },
  // NVIDIA
  { label: 'NVIDIA RTX 3060 12 GB',           vram: 12,  note: 'Great for small models',               vendor: 'nvidia' },
  { label: 'NVIDIA RTX 4070 12 GB',           vram: 12,  note: 'Fast inference for small models',      vendor: 'nvidia' },
  { label: 'NVIDIA RTX 4070 Ti Super 16 GB',  vram: 16,  note: 'Handles 13B–34B well',                 vendor: 'nvidia' },
  { label: 'NVIDIA RTX 4080 Super 16 GB',     vram: 16,  note: 'Fast 16 GB card',                      vendor: 'nvidia' },
  { label: 'NVIDIA RTX 4090 24 GB',           vram: 24,  note: 'Best consumer GPU for LLMs',           vendor: 'nvidia' },
  { label: 'NVIDIA RTX 5090 32 GB',           vram: 32,  note: 'Flagship Blackwell consumer GPU',      vendor: 'nvidia' },
  { label: 'NVIDIA RTX 6000 Ada 48 GB',       vram: 48,  note: 'Professional workstation GPU',         vendor: 'nvidia' },
  { label: 'NVIDIA A100 80 GB',               vram: 80,  note: 'Data-center grade',                    vendor: 'nvidia' },
  // AMD
  { label: 'AMD RX 7600 8 GB',                vram: 8,   note: 'Entry-level RDNA 3; ROCm support',     vendor: 'amd'    },
  { label: 'AMD RX 7700 XT 12 GB',            vram: 12,  note: 'Mid-range RDNA 3; ROCm support',       vendor: 'amd'    },
  { label: 'AMD RX 7800 XT 16 GB',            vram: 16,  note: 'Good value RDNA 3; ROCm support',      vendor: 'amd'    },
  { label: 'AMD RX 7900 XT 20 GB',            vram: 20,  note: 'High-end RDNA 3; ROCm support',        vendor: 'amd'    },
  { label: 'AMD RX 7900 XTX 24 GB',           vram: 24,  note: 'Top consumer RDNA 3; ROCm support',    vendor: 'amd'    },
  { label: 'AMD RX 9070 XT 16 GB',            vram: 16,  note: 'RDNA 4 mid-range; ROCm support',       vendor: 'amd'    },
  { label: 'AMD Radeon PRO W7900 48 GB',      vram: 48,  note: 'Workstation card; excellent ROCm',     vendor: 'amd'    },
  { label: 'AMD Instinct MI300X 192 GB',      vram: 192, note: 'Data-center; 192 GB HBM3 memory',      vendor: 'amd'    },
  // CPU
  { label: 'CPU RAM only (32 GB)',             vram: 32,  note: 'Slow but works (llama.cpp)',            vendor: 'cpu'    },
  { label: 'CPU RAM only (64 GB)',             vram: 64,  note: 'Slow but works (llama.cpp)',            vendor: 'cpu'    },
  { label: 'CPU RAM only (128 GB)',            vram: 128, note: 'Slow but works (llama.cpp)',            vendor: 'cpu'    },
];

export function calculate(input: CalcInput): CalcResult {
  const { paramsBillion, quantization, contextKTokens } = input;

  // Model size in GB
  const bytesPerWeight = BYTES_PER_WEIGHT[quantization];
  const modelSizeGB = (paramsBillion * 1e9 * bytesPerWeight) / 1e9;

  // KV cache: heuristic based on params * context
  const kvCacheGB = (paramsBillion * contextKTokens * KV_MB_PER_K_TOKEN_PER_B_PARAM) / 1024;

  // Buffer: 1 GB base + 5% of model size for overhead
  const bufferGB = Math.max(1.0, modelSizeGB * 0.05);

  const totalGB = modelSizeGB + kvCacheGB + bufferGB;

  const recommendation: HardwareRec[] = HARDWARE.map((hw) => ({
    label: hw.label,
    fits: hw.vram >= totalGB,
    vram: hw.vram,
    note: hw.note,
    vendor: hw.vendor,
  }));

  return {
    modelSizeGB: +modelSizeGB.toFixed(2),
    kvCacheGB: +kvCacheGB.toFixed(2),
    bufferGB: +bufferGB.toFixed(2),
    totalGB: +totalGB.toFixed(2),
    recommendation,
  };
}

export const QUANT_LABELS: Record<Quantization, string> = {
  FP16:   'FP16 — Full precision (2 bytes/param)',
  Q8_0:   'Q8_0 — 8-bit (1 byte/param)',
  Q6_K:   'Q6_K — 6-bit (~0.75 bytes/param)',
  Q5_K_M: 'Q5_K_M — 5-bit (~0.625 bytes/param)',
  Q4_K_M: 'Q4_K_M — 4-bit (~0.5 bytes/param) ★ Recommended',
  Q3_K_M: 'Q3_K_M — 3-bit (~0.375 bytes/param)',
  AWQ:    'AWQ — 4-bit Activation-aware (≈ Q4)',
};

export const QUANT_OPTIONS: Quantization[] = [
  'FP16', 'Q8_0', 'Q6_K', 'Q5_K_M', 'Q4_K_M', 'Q3_K_M', 'AWQ',
];
