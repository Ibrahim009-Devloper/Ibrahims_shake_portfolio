import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ArrowUp, Linkedin, Mail, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { data } = usePortfolio();

  const handleScrollTo = (selector: string) => {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-slate-900">
          
          {/* Brand Info */}
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {data.profile.name}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {data.profile.title}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Based in {data.profile.location} • Serving global clients
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-400">
            <button
              onClick={() => handleScrollTo('#hero')}
              className="hover:text-cyan-400 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => handleScrollTo('#services')}
              className="hover:text-cyan-400 transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => handleScrollTo('#work')}
              className="hover:text-cyan-400 transition-colors"
            >
              Work
            </button>
            <button
              onClick={() => handleScrollTo('#about')}
              className="hover:text-cyan-400 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => handleScrollTo('#contact')}
              className="hover:text-cyan-400 transition-colors"
            >
              Contact
            </button>
          </div>

          {/* Social & Contact Links */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <a
              href={data.contact.linkedIn.startsWith('http') ? data.contact.linkedIn : `https://${data.contact.linkedIn}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
            <a
              href={`mailto:${data.contact.email}`}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </a>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Back to top"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 MD. Ibrahim Shake Shuvo. All rights reserved.</p>
          <p className="text-slate-400">
            Professional B2B Prospecting & Automation
          </p>
        </div>

      </div>
    </footer>
  );
};
