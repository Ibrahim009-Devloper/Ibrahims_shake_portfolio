import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ProjectItem } from '../../types/portfolio';
import { 
  FileSpreadsheet, 
  ExternalLink, 
  Layers, 
  Wrench, 
  Database, 
  Eye, 
  CheckCircle,
  Plus
} from 'lucide-react';

export const PortfolioSection: React.FC = () => {
  const { data, setSelectedProject, setIsAdminOpen } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(data.projects.map((p) => p.category)))];

  const filteredProjects = selectedCategory === 'All'
    ? data.projects
    : data.projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="work" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Portfolio & Sample Deliverables
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-4">
              Selected Work
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Explore structured demo samples and research methodologies. Each project illustrates verified data fields, automated extraction workflows, and ready-to-use formats.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-cyan-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Manage Projects</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id || idx}
              id={`portfolio-card-${project.id}`}
              className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800/90 hover:border-cyan-500/40 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 flex flex-col justify-between group"
            >
              <div>
                {/* Badges row: Category & Sample tag */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {project.category}
                  </span>
                  {project.isDemoSample && (
                    <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-slate-800/90 text-slate-400 border border-slate-700/60">
                      Sample Dataset
                    </span>
                  )}
                </div>

                {/* Project Title */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {project.title}
                </h3>

                {/* Short Description */}
                <p className="text-sm text-slate-400 leading-relaxed mb-5">
                  {project.shortDescription}
                </p>

                {/* Key Spec 1: Type of data collected */}
                <div className="mb-4 pb-4 border-b border-slate-800/80 space-y-1">
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
                    <Database className="w-3 h-3 text-cyan-400" />
                    <span>Data Fields Collected:</span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium line-clamp-2">
                    {project.dataCollected}
                  </p>
                </div>

                {/* Key Spec 2: Tools & Output format */}
                <div className="grid grid-cols-2 gap-2 mb-5 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      Tools
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {project.tools.slice(0, 2).map((t, tIdx) => (
                        <span key={tIdx} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
                          {t}
                        </span>
                      ))}
                      {project.tools.length > 2 && (
                        <span className="text-[10px] text-slate-400 self-center">
                          +{project.tools.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      Output
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                      <FileSpreadsheet className="w-3 h-3" />
                      {project.outputFormat}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button: View Project */}
              <button
                onClick={() => setSelectedProject(project)}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800/90 hover:bg-cyan-400 hover:text-slate-950 border border-slate-700/80 hover:border-cyan-400 transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Project Case Study</span>
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
