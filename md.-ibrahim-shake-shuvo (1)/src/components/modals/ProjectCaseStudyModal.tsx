import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  X, 
  Database, 
  FileSpreadsheet, 
  ExternalLink, 
  CheckCircle, 
  Layers, 
  Wrench, 
  FileText,
  Table as TableIcon,
  Code
} from 'lucide-react';

export const ProjectCaseStudyModal: React.FC = () => {
  const { selectedProject, setSelectedProject } = usePortfolio();
  const [activeTab, setActiveTab] = useState<'table' | 'json'>('table');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProject, setSelectedProject]);

  if (!selectedProject) return null;

  const { caseStudy } = selectedProject;

  const handleRequestSimilar = () => {
    const projectCategory = selectedProject.category;
    setSelectedProject(null);
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      const selectEl = document.querySelector('#projectType') as HTMLSelectElement | null;
      if (selectEl) {
        for (let i = 0; i < selectEl.options.length; i++) {
          if (selectEl.options[i].text.toLowerCase().includes(projectCategory.toLowerCase()) || 
              projectCategory.toLowerCase().includes(selectEl.options[i].text.toLowerCase())) {
            selectEl.selectedIndex = i;
            break;
          }
        }
      }
    }
  };

  const sampleColumns = caseStudy.sampleRows && caseStudy.sampleRows.length > 0
    ? Object.keys(caseStudy.sampleRows[0])
    : [];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={() => setSelectedProject(null)}
    >
      <div 
        className="relative w-full max-w-4xl bg-[#0F1422] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        id="case-study-modal-container"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800/80 bg-slate-900/60 flex items-start justify-between sticky top-0 z-10 backdrop-blur-md">
          <div className="space-y-1.5 pr-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {selectedProject.category}
              </span>
              {selectedProject.isDemoSample && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  Sample Dataset Demonstration
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800">
                Format: {selectedProject.outputFormat}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {selectedProject.title}
            </h2>
          </div>

          <button
            onClick={() => setSelectedProject(null)}
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-6 sm:p-8 space-y-8 overflow-y-auto flex-1">
          
          {/* Overview & Objective */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                Project Overview
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {caseStudy.overview}
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Objective
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {caseStudy.objective}
              </p>
            </div>
          </div>

          {/* Research Source & Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2 flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-400" />
                Research Source
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {caseStudy.researchSource}
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-cyan-400" />
                Tools Used
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {caseStudy.toolsUsed.map((tool, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded bg-slate-800 text-xs font-mono font-medium text-cyan-300 border border-slate-700"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Data Fields Collected */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Structured Data Fields Extracted
            </h3>
            <div className="flex flex-wrap gap-2">
              {caseStudy.dataFields.map((field, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200"
                >
                  {field}
                </span>
              ))}
            </div>
          </div>

          {/* Step-by-Step Process */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3">
              Research & Extraction Process
            </h3>
            <div className="space-y-2.5">
              {caseStudy.process.map((step, idx) => (
                <div 
                  key={idx} 
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/40 border border-slate-800/60 text-sm text-slate-300"
                >
                  <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Final Output */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">
                Final Deliverable
              </div>
              <p className="text-sm font-medium text-slate-200">
                {caseStudy.finalOutput}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <CheckCircle className="w-3.5 h-3.5" />
              Verified & Cleaned
            </span>
          </div>

          {/* Interactive Sample Data Preview */}
          {caseStudy.sampleRows && caseStudy.sampleRows.length > 0 && (
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/90">
              <div className="p-3.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Sample Data Structure Preview
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ({caseStudy.sampleRows.length} sample rows shown)
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setActiveTab('table')}
                    className={`px-2.5 py-1 text-xs font-medium rounded flex items-center gap-1.5 transition-colors ${
                      activeTab === 'table' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <TableIcon className="w-3 h-3" />
                    <span>Table View</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('json')}
                    className={`px-2.5 py-1 text-xs font-medium rounded flex items-center gap-1.5 transition-colors ${
                      activeTab === 'json' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Code className="w-3 h-3" />
                    <span>JSON View</span>
                  </button>
                </div>
              </div>

              {activeTab === 'table' ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900/60 text-[11px] uppercase tracking-wider font-mono text-slate-400 border-b border-slate-800">
                      <tr>
                        {sampleColumns.map((col) => (
                          <th key={col} className="px-4 py-2.5 font-semibold">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-sans">
                      {caseStudy.sampleRows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-900/40 transition-colors">
                          {sampleColumns.map((col) => (
                            <td key={col} className="px-4 py-2.5 whitespace-nowrap text-slate-300 font-medium">
                              {col.toLowerCase().includes('email') ? (
                                <span className="text-cyan-400 font-mono text-[11px]">{row[col]}</span>
                              ) : col.toLowerCase().includes('status') ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  {row[col]}
                                </span>
                              ) : (
                                row[col]
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 bg-slate-950 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-60">
                  <pre>{JSON.stringify(caseStudy.sampleRows, null, 2)}</pre>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs text-slate-400">
            Need a custom dataset like this tailored to your market?
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedProject(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleRequestSimilar}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer shadow-sm shadow-cyan-400/20"
            >
              Request Similar Lead List
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
