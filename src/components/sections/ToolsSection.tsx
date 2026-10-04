import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Terminal, ShieldCheck, Zap, Cpu, Sparkles, Filter, SearchCode } from 'lucide-react';

export const ToolsSection: React.FC = () => {
  const { data } = usePortfolio();

  return (
    <section id="tools" className="py-20 md:py-24 bg-slate-950/40 border-y border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Technology & Methodologies
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-4">
            Tools & Technology
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            I utilize battle-tested automation tooling and research protocols to guarantee accurate data retrieval, rate-limit resilience, and zero duplicate noise.
          </p>
        </div>

        {/* Tools and Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.tools.map((tool) => (
            <div
              key={tool.id}
              className={`p-6 rounded-2xl border transition-all ${
                tool.highlight
                  ? 'bg-slate-900/90 border-cyan-500/30 shadow-lg shadow-cyan-950/10'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  {tool.category}
                </span>
                {tool.highlight && (
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Core Automation
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <span>{tool.name}</span>
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed">
                {tool.description}
              </p>
            </div>
          ))}
        </div>

        {/* Business Outcome Guarantee Callout */}
        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-[#0c1626] border border-slate-800/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Focused on Clean Business Outcomes
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Every tool is applied to produce reliable, automated web workflows with structured logging and error handling.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-cyan-300 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 whitespace-nowrap">
            Reliable Python Automation
          </span>
        </div>

      </div>
    </section>
  );
};
