import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Check, Shield } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const { data } = usePortfolio();

  return (
    <section className="py-6 border-y border-slate-800/80 bg-slate-950/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center sm:justify-between gap-y-3 gap-x-6 text-xs sm:text-sm font-medium text-slate-300">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Core Expertise:</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {data.trustStrip.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 group-hover:scale-125 transition-transform" />
                <span className="text-slate-300 group-hover:text-white transition-colors">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
