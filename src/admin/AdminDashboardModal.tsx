import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ServiceItem, ProjectItem } from '../types/portfolio';
import { 
  X, 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  Download, 
  Check, 
  Sparkles,
  Layers,
  FileSpreadsheet,
  Settings,
  User,
  Layout,
  Briefcase,
  Phone,
  Database
} from 'lucide-react';

export const AdminDashboardModal: React.FC = () => {
  const { 
    data, 
    isAdminOpen, 
    setIsAdminOpen, 
    updateProfile, 
    updateHero, 
    updateAbout, 
    updateCta, 
    updateContact,
    addService,
    updateService,
    deleteService,
    addProject,
    updateProject,
    deleteProject,
    resetToDefault,
    exportJson,
    importJson
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'profile' | 'services' | 'projects' | 'about' | 'contact' | 'backup'>('profile');
  const [saveNotification, setSaveNotification] = useState(false);

  // Editing state for Service
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [serviceFormData, setServiceFormData] = useState<Omit<ServiceItem, 'id'>>({
    title: '',
    description: '',
    iconName: 'Target',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  // Editing state for Project
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projectFormData, setProjectFormData] = useState<Omit<ProjectItem, 'id'>>({
    title: '',
    shortDescription: '',
    category: 'B2B Business Lead List',
    dataCollected: '',
    tools: ['Python', 'Web Research'],
    outputFormat: 'Excel (.xlsx) / CSV',
    isDemoSample: true,
    caseStudy: {
      overview: '',
      objective: '',
      researchSource: '',
      dataFields: ['Company Name', 'Contact Person', 'Email'],
      process: ['Define target parameters', 'Collect records', 'Verify & format'],
      toolsUsed: ['Python'],
      finalOutput: 'Clean Excel spreadsheet'
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  const notifySave = () => {
    setSaveNotification(true);
    setTimeout(() => setSaveNotification(false), 2500);
  };

  if (!isAdminOpen) return null;

  if (!isAuthenticated) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        onClick={() => setIsAdminOpen(false)}
      >
        <div 
          className="relative w-full max-w-md bg-[#0F1422] border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Admin Authentication</h3>
                <p className="text-xs text-slate-400">Enter credentials to access Portfolio Manager</p>
              </div>
            </div>
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (loginUser === 'admin' && loginPass === 'ibrahim123') {
                setIsAuthenticated(true);
                setLoginError('');
              } else {
                setLoginError('Invalid username or password.');
              }
            }}
            className="space-y-4"
          >
            {loginError && (
              <div className="p-3 bg-red-950/30 border border-red-800/40 rounded-xl text-xs text-red-400">
                {loginError}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Username</label>
              <input
                type="text"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                placeholder="Enter username"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                required
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-lg shadow-cyan-500/20"
              >
                Login to Dashboard
              </button>
            </div>
            <p className="text-[11px] text-slate-500 text-center mt-3">
              Default credentials: <code className="text-cyan-400">admin</code> / <code className="text-cyan-400">ibrahim123</code>
            </p>
          </form>
        </div>
      </div>
    );
  }

  // Handle Profile Image Upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ avatarUrl: reader.result as string });
        notifySave();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto bg-black/80 backdrop-blur-md"
      onClick={() => setIsAdminOpen(false)}
    >
      <div 
        className="relative w-full max-w-5xl bg-[#0F1422] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        id="admin-dashboard-container"
      >
        {/* Admin Header */}
        <div className="p-5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Portfolio Content Manager</span>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Live Editing
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Changes persist in your browser instantly and update the live website.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {saveNotification && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-3 py-1.5 text-xs font-semibold text-red-400 bg-red-950/30 hover:bg-red-950/60 border border-red-800/40 rounded-lg transition-colors"
            >
              Logout
            </button>
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              aria-label="Close Admin"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-5 py-2.5 bg-slate-950 border-b border-slate-800 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'profile' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & Hero</span>
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'services' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Services ({data.services.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'projects' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Projects ({data.projects.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'about' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>About & Background</span>
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'contact' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Contact & CTA</span>
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'backup' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Backup / Reset</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm">
          
          {/* TAB 1: Profile & Hero */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              
              {/* Profile Card */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-bold text-cyan-400">
                  Profile Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={data.profile.name}
                      onChange={(e) => {
                        updateProfile({ name: e.target.value });
                        notifySave();
                      }}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      value={data.profile.title}
                      onChange={(e) => {
                        updateProfile({ title: e.target.value });
                        notifySave();
                      }}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={data.profile.location}
                      onChange={(e) => {
                        updateProfile({ location: e.target.value });
                        notifySave();
                      }}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Availability Status Text
                    </label>
                    <input
                      type="text"
                      value={data.profile.status}
                      onChange={(e) => {
                        updateProfile({ status: e.target.value });
                        notifySave();
                      }}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Profile Photo / Avatar option */}
                <div className="pt-2 border-t border-slate-800">
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Profile Image
                  </label>
                  <div className="flex items-center gap-4">
                    {data.profile.avatarUrl ? (
                      <img
                        src={data.profile.avatarUrl}
                        alt="Profile"
                        className="w-12 h-12 rounded-xl object-cover border border-cyan-500/40"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-cyan-400">
                        IS
                      </div>
                    )}

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 cursor-pointer">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Real Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                          />
                        </label>
                        {data.profile.avatarUrl && (
                          <button
                            onClick={() => {
                              updateProfile({ avatarUrl: '' });
                              notifySave();
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-red-400 bg-slate-800 hover:bg-slate-700"
                          >
                            Remove / Use Initials
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Default uses clean professional initials monogram. Uploading an image updates the hero showcase instantly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Section Content */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-bold text-cyan-400">
                  Hero Section Headlines
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Main Headline
                  </label>
                  <input
                    type="text"
                    value={data.hero.headline}
                    onChange={(e) => {
                      updateHero({ headline: e.target.value });
                      notifySave();
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Supporting Headline
                  </label>
                  <textarea
                    rows={2}
                    value={data.hero.supportingHeadline}
                    onChange={(e) => {
                      updateHero({ supportingHeadline: e.target.value });
                      notifySave();
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Supporting Paragraph
                  </label>
                  <textarea
                    rows={2}
                    value={data.hero.supportingParagraph}
                    onChange={(e) => {
                      updateHero({ supportingParagraph: e.target.value });
                      notifySave();
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Primary CTA Text
                    </label>
                    <input
                      type="text"
                      value={data.hero.primaryCtaText}
                      onChange={(e) => {
                        updateHero({ primaryCtaText: e.target.value });
                        notifySave();
                      }}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Secondary CTA Text
                    </label>
                    <input
                      type="text"
                      value={data.hero.secondaryCtaText}
                      onChange={(e) => {
                        updateHero({ secondaryCtaText: e.target.value });
                        notifySave();
                      }}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Services */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Manage Services</h3>
                  <p className="text-xs text-slate-400">Add, edit, or remove the services displayed on your portfolio.</p>
                </div>
                {!isAddingService && !editingService && (
                  <button
                    onClick={() => {
                      setIsAddingService(true);
                      setServiceFormData({
                        title: '',
                        description: '',
                        iconName: 'Target',
                        tags: []
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Service</span>
                  </button>
                )}
              </div>

              {/* Service Form (Add / Edit) */}
              {(isAddingService || editingService) && (
                <div className="p-4 bg-slate-900 border border-cyan-500/40 rounded-xl space-y-4">
                  <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                    {isAddingService ? 'Add New Service' : 'Edit Service'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                      <input
                        type="text"
                        value={serviceFormData.title}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, title: e.target.value })}
                        placeholder="e.g. B2B Lead Generation"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Icon</label>
                      <select
                        value={serviceFormData.iconName}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, iconName: e.target.value as any })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                      >
                        <option value="Target">Target (Lead Gen)</option>
                        <option value="Building2">Building2 (Company List)</option>
                        <option value="Search">Search (Web Research)</option>
                        <option value="MapPin">MapPin (Google Maps)</option>
                        <option value="Database">Database (Web Scraping)</option>
                        <option value="CheckCheck">CheckCheck (Data Cleaning)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={serviceFormData.description}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                      placeholder="1-2 sentences describing the deliverable"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Tags</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Type tag and click Add"
                        className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (tagInput.trim()) {
                            setServiceFormData({
                              ...serviceFormData,
                              tags: [...(serviceFormData.tags || []), tagInput.trim()]
                            });
                            setTagInput('');
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-white"
                      >
                        Add Tag
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(serviceFormData.tags || []).map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-xs text-slate-300 flex items-center gap-1">
                          {t}
                          <button
                            type="button"
                            onClick={() => {
                              setServiceFormData({
                                ...serviceFormData,
                                tags: serviceFormData.tags?.filter((_, i) => i !== idx)
                              });
                            }}
                            className="hover:text-red-400"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => {
                        if (!serviceFormData.title.trim()) return;
                        if (isAddingService) {
                          addService(serviceFormData);
                          setIsAddingService(false);
                        } else if (editingService) {
                          updateService(editingService.id, serviceFormData);
                          setEditingService(null);
                        }
                        notifySave();
                      }}
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300"
                    >
                      Save Service
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingService(false);
                        setEditingService(null);
                      }}
                      className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white bg-slate-800"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Services List */}
              <div className="space-y-3">
                {data.services.map((svc) => (
                  <div key={svc.id} className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{svc.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">{svc.iconName}</span>
                      </div>
                      <p className="text-xs text-slate-400">{svc.description}</p>
                      {svc.tags && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {svc.tags.map((t, idx) => (
                            <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingService(svc);
                          setServiceFormData({
                            title: svc.title,
                            description: svc.description,
                            iconName: svc.iconName,
                            tags: svc.tags || []
                          });
                          setIsAddingService(false);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
                        title="Edit Service"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete service "${svc.title}"?`)) {
                            deleteService(svc.id);
                            notifySave();
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Projects */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Manage Portfolio Projects</h3>
                  <p className="text-xs text-slate-400">Add or edit sample datasets, case study details, and data fields.</p>
                </div>
                {!isAddingProject && !editingProject && (
                  <button
                    onClick={() => {
                      setIsAddingProject(true);
                      setProjectFormData({
                        title: '',
                        shortDescription: '',
                        category: 'B2B Business Lead List',
                        dataCollected: 'Company Name, Contact Person, Verified Email',
                        tools: ['Python', 'Web Research'],
                        outputFormat: 'Excel (.xlsx) / CSV',
                        isDemoSample: true,
                        caseStudy: {
                          overview: 'Detailed project overview...',
                          objective: 'Project objective...',
                          researchSource: 'Public directories & websites',
                          dataFields: ['Company Name', 'Contact Person', 'Email'],
                          process: ['Step 1', 'Step 2'],
                          toolsUsed: ['Python'],
                          finalOutput: 'Clean Excel spreadsheet'
                        }
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                )}
              </div>

              {/* Project Form (Add / Edit) */}
              {(isAddingProject || editingProject) && (
                <div className="p-5 bg-slate-900 border border-cyan-500/40 rounded-xl space-y-4">
                  <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                    {isAddingProject ? 'Add New Project' : 'Edit Project'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Project Title</label>
                      <input
                        type="text"
                        value={projectFormData.title}
                        onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                        placeholder="e.g. B2B Business Lead List"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                      <input
                        type="text"
                        value={projectFormData.category}
                        onChange={(e) => setProjectFormData({ ...projectFormData, category: e.target.value })}
                        placeholder="e.g. B2B Business Lead List, Google Maps Business Leads"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Short Description</label>
                    <textarea
                      rows={2}
                      value={projectFormData.shortDescription}
                      onChange={(e) => setProjectFormData({ ...projectFormData, shortDescription: e.target.value })}
                      placeholder="Brief card summary"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Data Fields Collected</label>
                      <input
                        type="text"
                        value={projectFormData.dataCollected}
                        onChange={(e) => setProjectFormData({ ...projectFormData, dataCollected: e.target.value })}
                        placeholder="e.g. Company Name, Contact Person, Title, Email, LinkedIn"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Output Format</label>
                      <input
                        type="text"
                        value={projectFormData.outputFormat}
                        onChange={(e) => setProjectFormData({ ...projectFormData, outputFormat: e.target.value })}
                        placeholder="e.g. Excel (.xlsx) / CSV"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                      />
                    </div>
                  </div>

                  {/* Case Study Details */}
                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    <span className="text-xs font-bold text-slate-300 block">Case Study Modal Details</span>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Overview</label>
                      <textarea
                        rows={2}
                        value={projectFormData.caseStudy.overview}
                        onChange={(e) => setProjectFormData({
                          ...projectFormData,
                          caseStudy: { ...projectFormData.caseStudy, overview: e.target.value }
                        })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Objective</label>
                      <textarea
                        rows={2}
                        value={projectFormData.caseStudy.objective}
                        onChange={(e) => setProjectFormData({
                          ...projectFormData,
                          caseStudy: { ...projectFormData.caseStudy, objective: e.target.value }
                        })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Research Source</label>
                      <input
                        type="text"
                        value={projectFormData.caseStudy.researchSource}
                        onChange={(e) => setProjectFormData({
                          ...projectFormData,
                          caseStudy: { ...projectFormData.caseStudy, researchSource: e.target.value }
                        })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => {
                        if (!projectFormData.title.trim()) return;
                        if (isAddingProject) {
                          addProject(projectFormData);
                          setIsAddingProject(false);
                        } else if (editingProject) {
                          updateProject(editingProject.id, projectFormData);
                          setEditingProject(null);
                        }
                        notifySave();
                      }}
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300"
                    >
                      Save Project
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingProject(false);
                        setEditingProject(null);
                      }}
                      className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white bg-slate-800"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Projects List */}
              <div className="space-y-3">
                {data.projects.map((proj) => (
                  <div key={proj.id} className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{proj.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">{proj.category}</span>
                        {proj.isDemoSample && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">Sample</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{proj.shortDescription}</p>
                      <p className="text-[11px] text-slate-400">Fields: {proj.dataCollected}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingProject(proj);
                          setProjectFormData({
                            title: proj.title,
                            shortDescription: proj.shortDescription,
                            category: proj.category,
                            dataCollected: proj.dataCollected,
                            tools: proj.tools,
                            outputFormat: proj.outputFormat,
                            isDemoSample: proj.isDemoSample,
                            caseStudy: { ...proj.caseStudy }
                          });
                          setIsAddingProject(false);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
                        title="Edit Project"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete project "${proj.title}"?`)) {
                            deleteProject(proj.id);
                            notifySave();
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: About & Background */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-bold text-cyan-400">
                  About Me Content
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={data.about.title}
                    onChange={(e) => {
                      updateAbout({ title: e.target.value });
                      notifySave();
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Positioning Statement
                  </label>
                  <textarea
                    rows={4}
                    value={data.about.statement}
                    onChange={(e) => {
                      updateAbout({ statement: e.target.value });
                      notifySave();
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                  />
                </div>

                {/* Background education */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Education / Background Detail
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Degree / Qualification</label>
                      <input
                        type="text"
                        value={data.about.background.degree}
                        onChange={(e) => {
                          updateAbout({
                            background: { ...data.about.background, degree: e.target.value }
                          });
                          notifySave();
                        }}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Institution</label>
                      <input
                        type="text"
                        value={data.about.background.institution}
                        onChange={(e) => {
                          updateAbout({
                            background: { ...data.about.background, institution: e.target.value }
                          });
                          notifySave();
                        }}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Years / Period</label>
                      <input
                        type="text"
                        value={data.about.background.period}
                        onChange={(e) => {
                          updateAbout({
                            background: { ...data.about.background, period: e.target.value }
                          });
                          notifySave();
                        }}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Contact & CTA */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              {/* Contact details */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-bold text-cyan-400">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={data.contact.email}
                      onChange={(e) => {
                        updateContact({ email: e.target.value });
                        notifySave();
                      }}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      value={data.contact.linkedIn}
                      onChange={(e) => {
                        updateContact({ linkedIn: e.target.value });
                        notifySave();
                      }}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* CTA section */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-bold text-cyan-400">
                  Call-To-Action (CTA) Banner
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">CTA Headline</label>
                  <input
                    type="text"
                    value={data.cta.headline}
                    onChange={(e) => {
                      updateCta({ headline: e.target.value });
                      notifySave();
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">CTA Description</label>
                  <textarea
                    rows={2}
                    value={data.cta.description}
                    onChange={(e) => {
                      updateCta({ description: e.target.value });
                      notifySave();
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Button Text</label>
                    <input
                      type="text"
                      value={data.cta.primaryButtonText}
                      onChange={(e) => {
                        updateCta({ primaryButtonText: e.target.value });
                        notifySave();
                      }}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Secondary Button Text</label>
                    <input
                      type="text"
                      value={data.cta.secondaryButtonText}
                      onChange={(e) => {
                        updateCta({ secondaryButtonText: e.target.value });
                        notifySave();
                      }}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Backup / Reset */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-bold text-cyan-400">
                  Data Portability & Reset
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  You can download your entire customized portfolio configuration as a JSON file, import a previously saved JSON configuration, or reset to the original default information anytime.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      const json = exportJson();
                      const blob = new Blob([json], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `portfolio-config-${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download JSON Backup</span>
                  </button>

                  <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Import JSON File</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const content = event.target?.result as string;
                            if (content) {
                              const success = importJson(content);
                              if (success) {
                                notifySave();
                                alert('Portfolio configuration successfully loaded!');
                              } else {
                                alert('Failed to parse JSON configuration. Please ensure it has a valid format.');
                              }
                            }
                          };
                          reader.readAsText(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to reset all portfolio content to default?')) {
                        resetToDefault();
                        notifySave();
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-red-400 bg-red-950/20 hover:bg-red-950/50 border border-red-800/40 ml-auto"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset to Defaults</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            All edits are automatically saved to local storage.
          </span>
          <button
            onClick={() => setIsAdminOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
          >
            Done Editing
          </button>
        </div>

      </div>
    </div>
  );
};
