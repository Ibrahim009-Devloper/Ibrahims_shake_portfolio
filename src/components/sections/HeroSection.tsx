import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  ArrowRight, 
  Layers, 
  MapPin, 
  CheckCircle2, 
  Terminal, 
  FileSpreadsheet, 
  ShieldCheck, 
  Sparkles,
  Database,
  Code2
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { data, setIsAdminOpen } = usePortfolio();

  const handleScrollTo = (selector: string) => {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Professional Role Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                PYTHON WEB AUTOMATION &amp; WEB SCRAPING | DHAKA, BANGLADESH
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15] mb-5">
              {data.hero.headline}
            </h1>

            {/* Supporting Headline */}
            <h2 className="text-lg sm:text-xl font-medium text-cyan-300/90 leading-relaxed mb-4">
              {data.hero.supportingHeadline}
            </h2>

            {/* Concise Supporting Paragraph */}
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mb-8">
              {data.hero.supportingParagraph}
            </p>

            {/* Highlighted Visual Capabilities */}
            <div className="w-full mb-8">
              <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Core Capabilities</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.hero.capabilities.map((cap, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900/90 text-slate-200 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/80 transition-colors"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => handleScrollTo('#contact')}
                id="hero-primary-cta"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-400/20 active:scale-[0.98] cursor-pointer"
              >
                <span>{data.hero.primaryCtaText}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                onClick={() => handleScrollTo('#work')}
                id="hero-secondary-cta"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>{data.hero.secondaryCtaText}</span>
              </button>
            </div>

            {/* Trust Indicator */}
            <div className="mt-8 pt-6 border-t border-slate-900/80 w-full flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Manual Verification & Quality Check</span>
              </span>
              <span className="flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                <span>Google Sheets &amp; CSV Formats</span>
              </span>
            </div>
          </div>

          {/* Right Column: Professional Profile Card & Structured Data Preview */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-md bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden backdrop-blur-sm">
              
              {/* Profile Header */}
              <div className="flex items-start gap-4 mb-6">
                {/* Profile Avatar / Placeholder (no fake face) */}
                <div className="relative shrink-0">
                  {data.profile.avatarUrl ? (
                    <img
                      src={data.profile.avatarUrl}
                      alt={data.profile.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500/30"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-cyan-500/30 flex items-center justify-center shadow-inner">
                      <span className="text-xl font-bold tracking-tight text-cyan-400">
                        IS
                      </span>
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0B0F19]" title="Available for work" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-white truncate">
                      {data.profile.name}
                    </h3>
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  </div>
                  <p className="text-xs text-slate-400 leading-snug mb-1">
                    {data.profile.title}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{data.profile.location}</span>
                  </p>
                </div>
              </div>

              {/* Status and Tools Strip */}
              <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 mb-5">
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <span className="text-slate-400 font-medium">Status</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    {data.profile.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Core Stack</span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300">
                      Python
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300">
                      Playwright
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300">
                      Selenium
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Data Schema Demonstration Snippet */}
              <div className="bg-[#070A10] rounded-xl p-3.5 border border-slate-800 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 text-cyan-400">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>sample_lead_record.json</span>
                  </div>
                  <span className="text-emerald-400 font-sans text-[10px] uppercase font-bold tracking-wider">
                    Verified Sample
                  </span>
                </div>
                
                <div className="space-y-1 text-slate-300 text-[11px] leading-relaxed select-none">
                  <div className="flex justify-between">
                    <span className="text-slate-400">&quot;company&quot;:</span>
                    <span className="text-cyan-300 truncate max-w-[200px]">&quot;Apex Solutions Ltd&quot;</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">&quot;decision_maker&quot;:</span>
                    <span className="text-slate-200">&quot;Sarah Vance&quot;</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">&quot;title&quot;:</span>
                    <span className="text-slate-300">&quot;Managing Director&quot;</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">&quot;work_email&quot;:</span>
                    <span className="text-emerald-400">&quot;s.vance@apex-demo.com&quot;</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">&quot;linkedin&quot;:</span>
                    <span className="text-blue-400">&quot;in/demo-sarah-vance&quot;</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-900 text-[10px]">
                    <span className="text-slate-400">validation_status:</span>
                    <span className="text-emerald-400 font-semibold">100% DELIVERABLE</span>
                  </div>
                </div>
              </div>

              {/* Small note on replaceability */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span>Direct client deliverables</span>
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="text-cyan-400 hover:underline"
                >
                  Edit profile details
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
