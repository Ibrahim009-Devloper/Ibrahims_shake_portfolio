import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  Target, 
  Building2, 
  Search, 
  MapPin, 
  Database, 
  CheckCheck,
  ArrowRight
} from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const { data } = usePortfolio();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Target':
        return <Target className="w-5 h-5 text-cyan-400" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-cyan-400" />;
      case 'Search':
        return <Search className="w-5 h-5 text-cyan-400" />;
      case 'MapPin':
        return <MapPin className="w-5 h-5 text-cyan-400" />;
      case 'Database':
        return <Database className="w-5 h-5 text-cyan-400" />;
      case 'CheckCheck':
        return <CheckCheck className="w-5 h-5 text-cyan-400" />;
      default:
        return <Target className="w-5 h-5 text-cyan-400" />;
    }
  };

  const handleInquireService = (serviceTitle: string) => {
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      // Preselect in contact form
      const selectEl = document.querySelector('#projectType') as HTMLSelectElement | null;
      if (selectEl) {
        // Find matching option or set value
        for (let i = 0; i < selectEl.options.length; i++) {
          if (selectEl.options[i].text.toLowerCase().includes(serviceTitle.toLowerCase()) || 
              serviceTitle.toLowerCase().includes(selectEl.options[i].text.toLowerCase())) {
            selectEl.selectedIndex = i;
            break;
          }
        }
      }
    }
  };

  return (
    <section id="services" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Services & Deliverables
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-4">
            How I Can Help
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            I specialize in gathering targeted prospect intelligence and structured web data. Every dataset is custom-extracted, verified, and delivered in clean spreadsheet format.
          </p>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.services.map((service, index) => (
            <div
              key={service.id || index}
              id={`service-card-${index}`}
              className="group relative bg-slate-900/70 hover:bg-slate-900/95 border border-slate-800/90 hover:border-cyan-500/40 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/20 flex flex-col justify-between"
            >
              <div>
                {/* Icon & Index */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10 transition-colors">
                    {getIcon(service.iconName)}
                  </div>
                  <span className="font-mono text-xs text-slate-400">
                    0{index + 1}
                  </span>
                </div>

                {/* Service Title */}
                <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-cyan-300 transition-colors">
                  {service.title}
                </h3>

                {/* 1-2 sentence description */}
                <p className="text-sm text-slate-400 leading-relaxed mb-5">
                  {service.description}
                </p>
              </div>

              {/* Tags and Action */}
              <div>
                {service.tags && service.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-800/80 mb-4">
                    {service.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-800/60 text-slate-300 border border-slate-700/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => handleInquireService(service.title)}
                  className="w-full inline-flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-cyan-400 pt-2 transition-colors cursor-pointer"
                >
                  <span>Inquire for this service</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
