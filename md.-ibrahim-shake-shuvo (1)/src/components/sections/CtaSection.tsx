import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ArrowRight, Mail, MessageSquare } from 'lucide-react';

export const CtaSection: React.FC = () => {
  const { data } = usePortfolio();

  const handleScrollToContact = (focusInput = false) => {
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      if (focusInput) {
        setTimeout(() => {
          const nameInput = document.querySelector('#contact-name') as HTMLInputElement | null;
          nameInput?.focus();
        }, 400);
      }
    }
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Prominent Banner Card */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#0F172A] to-[#0A101F] border border-cyan-500/30 p-8 sm:p-12 lg:p-16 text-center shadow-2xl shadow-cyan-950/20 overflow-hidden">
          {/* Subtle glow circle behind */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                Ready to scale your outreach?
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight mb-4">
              {data.cta.headline}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
              {data.cta.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => handleScrollToContact(true)}
                id="cta-start-project-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-400/25 cursor-pointer active:scale-95"
              >
                <span>{data.cta.primaryButtonText}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                onClick={() => handleScrollToContact(false)}
                id="cta-contact-me-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{data.cta.secondaryButtonText}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
