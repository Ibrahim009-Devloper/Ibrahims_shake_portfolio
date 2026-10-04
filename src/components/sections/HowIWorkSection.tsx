import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const HowIWorkSection: React.FC = () => {
  const { data } = usePortfolio();

  return (
    <section id="process" className="py-20 md:py-24 bg-slate-950/40 border-y border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Workflow & Process
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-4">
            How I Work
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            A clear, 4-step process ensuring every automated workflow is reliable, error-handled, and production-ready.
          </p>
        </div>

        {/* 4 Connected Cards / Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {data.howIWork.map((step, index) => (
            <div
              key={step.stepNumber}
              id={`process-step-${index + 1}`}
              className="relative bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-500/30 transition-all group"
            >
              <div>
                {/* Step Number & Line indicator */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xl sm:text-2xl font-black text-cyan-400/90 group-hover:text-cyan-300 transition-colors">
                    {step.stepNumber}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center border border-slate-700/60 text-slate-400 group-hover:text-cyan-400 group-hover:border-cyan-500/40 transition-colors">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>

                {/* Step Title */}
                <h3 className="text-base sm:text-lg font-bold text-white mb-2.5">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-sm text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Bottom connecting accent for large screens */}
              <div className="mt-6 pt-3 border-t border-slate-800/60 flex items-center text-[11px] text-slate-400">
                {index < 3 ? (
                  <span className="flex items-center gap-1 text-slate-400 group-hover:text-slate-300">
                    <span>Proceeds to 0{index + 2}</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                ) : (
                  <span className="text-emerald-400/90 font-medium">Auto-Synced &amp; Ready</span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
