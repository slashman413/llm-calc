const FAQS = [
  {
    q: 'Why does the Context Window use so much VRAM?',
    a: `Every token you feed into an LLM generates a Key-Value (KV) cache entry for each transformer layer.
        A 128K context with a 70B model can require 10–20 GB on its own — on top of the model weights.
        If you mostly do short conversations, set context to 4K–8K to save significant VRAM.`,
  },
  {
    q: 'What is the best quantization for quality vs. VRAM?',
    a: `Q4_K_M is widely considered the sweet spot. It reduces a 7B FP16 model (~14 GB) down to ~4 GB
        with minimal quality loss (often &lt;1% perplexity increase). Q8_0 is near-lossless but doubles the
        size. Q3_K_M saves more VRAM but noticeably degrades quality. AWQ is great for GPU inference with
        better throughput than GGUF at the same bit-depth.`,
  },
  {
    q: 'Can I run a model that exceeds my VRAM using CPU RAM?',
    a: `Yes — tools like llama.cpp support GPU-CPU split loading. If a 70B Q4 model needs 40 GB but you
        only have a 24 GB GPU, you can load some layers to GPU and the rest to CPU RAM. Performance drops
        significantly for CPU layers, but it works. "CPU RAM only" rows in the table above assume this
        approach.`,
  },
  {
    q: 'How accurate are these estimates?',
    a: `The estimates are designed for quick planning, not precision benchmarking. Actual VRAM usage varies
        by model architecture (number of layers, head dimensions), framework (llama.cpp, vLLM, Transformers),
        batch size, and system overhead. For precise numbers, run the model with --verbose or check
        community benchmarks on llm.ggml.ai.`,
  },
];

export default function FAQ() {
  return (
    <section className="mt-12 mb-8 max-w-3xl mx-auto px-4">
      <h2 className="text-xl font-bold text-slate-200 mb-6 text-center">Frequently Asked Questions</h2>
      <div className="flex flex-col gap-5">
        {FAQS.map(({ q, a }) => (
          <details
            key={q}
            className="group bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden"
          >
            <summary className="px-5 py-4 cursor-pointer text-sm font-semibold text-slate-200 flex justify-between items-center gap-4 hover:bg-slate-700/40 transition-colors select-none">
              <span>{q}</span>
              <span className="text-cyan-400 group-open:rotate-180 transition-transform flex-shrink-0">▼</span>
            </summary>
            <p
              className="px-5 pb-4 pt-2 text-sm text-slate-400 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: a }}
            />
          </details>
        ))}
      </div>
    </section>
  );
}
