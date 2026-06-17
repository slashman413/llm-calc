import { useT } from '../i18n/LanguageContext';

export default function FAQ() {
  const { t } = useT();

  return (
    <section className="mt-12 mb-8 max-w-3xl mx-auto px-4">
      <h2 className="text-xl font-bold text-slate-200 mb-6 text-center">{t.faqTitle}</h2>
      <div className="flex flex-col gap-5">
        {t.faqs.map(({ q, a }) => (
          <details
            key={q}
            className="group bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden"
          >
            <summary className="px-5 py-4 cursor-pointer text-sm font-semibold text-slate-200 flex justify-between items-center gap-4 hover:bg-slate-700/40 transition-colors select-none">
              <span>{q}</span>
              <span className="text-cyan-400 group-open:rotate-180 transition-transform flex-shrink-0">▼</span>
            </summary>
            <p className="px-5 pb-4 pt-2 text-sm text-slate-400 leading-relaxed">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
