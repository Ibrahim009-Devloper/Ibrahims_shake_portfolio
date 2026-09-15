import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { GraduationCap, CheckCircle2, UserCheck, Shield, Sparkles } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { data } = usePortfolio();
  const { about, profile } = data;

  return (
    <section id="about" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-4xl mx-auto">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Professional Profile
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-6">
            {about.title}
          </h2>

          {/* Core Positioning Statement */}
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal mb-6">
              &ldquo;{about.statement}&rdquo;
            </p>

            {/* Mentioned capabilities & tools */}
            <div className="pt-6 border-t border-slate-800/80">
              <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Specialized Competencies</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {about.capabilities.map((cap, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-slate-800/80 text-xs font-medium text-slate-200 border border-slate-700/60"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Small Background Supporting Detail */}
          <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-slate-400">
                <GraduationCap className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">
                  Background & Education
                </span>
                <h4 className="text-sm font-bold text-white">
                  {about.background.degree}
                </h4>
                <p className="text-xs text-slate-400">
                  {about.background.institution}
                </p>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="px-2.5 py-1 rounded-full text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800">
                {about.background.period}
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
