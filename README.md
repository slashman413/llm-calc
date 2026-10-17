# llm-calc — Local LLM VRAM & RAM calculator

**Will this model fit on my GPU?** Pick a parameter count, a quantization and a context
length, and get the memory you need (weights + KV cache + runtime buffer), plus which GPUs,
Macs and unified-memory boxes can run it.

**▶ Use it: [slashmantools.us/llm-calc](https://slashmantools.us/llm-calc/)**. It's free, runs in your browser, and needs no signup.

## What it covers

- **Quantizations:** FP16, Q8_0, Q6_K, Q5_K_M, Q4_K_M, Q3_K_M (llama.cpp / Ollama GGUF) and AWQ (vLLM).
- **Context length:** 2K to 128K tokens. KV cache is often what pushes a model that fits into one that doesn't.
- **Hardware:** NVIDIA RTX 30/40/50, RTX 6000 Ada, RTX PRO 6000 Blackwell, A100,
  **DGX Spark (GB10, 128 GB unified)**, AMD Radeon RX 7000/9000 and Ryzen AI Max+ 395 (Strix Halo),
  Apple M-series 8 GB to 512 GB unified memory, and CPU-only RAM.
- **Model pages:** [/llm-calc/models/](https://slashmantools.us/llm-calc/models/) has per-model VRAM tables
  (Llama 3.1/3.3, Qwen2.5 / Qwen2.5-Coder, DeepSeek-R1 70B/671B, Mistral, Mixtral, Gemma 2, Phi-4).

## How the estimate is calculated

```
weights_GB  = params × bytes_per_weight(quant)    # e.g. Q4_K_M ≈ 0.61 bytes/param (real GGUF sizes, not 4/8)
kv_cache_GB = context_k_tokens × 0.064 × params^0.4   # fitted to modern GQA models (8 KV heads × 128 head_dim)
total_GB    = weights_GB + kv_cache_GB + runtime buffer
```

The coefficients are in [`src/utils/calculator.ts`](src/utils/calculator.ts). These are estimates. Real usage
varies by runtime (llama.cpp, Ollama, vLLM, SGLang), batch size and KV-cache quantization. If you measure a model
that is far off, please open an issue with the numbers.

## Running two models on one DGX Spark?

The GB10's 128 GB of unified memory looks like plenty, until two inference engines start
competing for it. Notes from a box that does this every day:
[DGX Spark dual-model deployment guide](https://slashmantools.us/blog/dgx-spark-kit/).

## Develop

```bash
npm install
npm run dev      # Vite dev server
npm run build    # tsc -b && vite build → dist/
npm run lint
```

Vite + React 19 + TypeScript + Tailwind. Static, crawlable model pages live in [`public/models/`](public/models/) and
deploy with the app (listed in `public/sitemap.xml`). UI is available in English, 繁體中文, हिन्दी, Español and Français.

---

More free, client-side tools: [slashmantools.us](https://slashmantools.us/) · Built by [@slashman413](https://github.com/slashman413) ·
[Support on Ko-fi](https://ko-fi.com/ytstories0413)
