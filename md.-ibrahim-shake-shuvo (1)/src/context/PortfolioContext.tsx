import React, { createContext, useContext, useState, useEffect } from 'react';
import { PortfolioData, ServiceItem, ProjectItem, ToolItem } from '../types/portfolio';
import { initialPortfolioData } from '../data/initialPortfolioData';

interface PortfolioContextType {
  data: PortfolioData;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  selectedProject: ProjectItem | null;
  setSelectedProject: (project: ProjectItem | null) => void;
  updateProfile: (profile: Partial<PortfolioData['profile']>) => void;
  updateHero: (hero: Partial<PortfolioData['hero']>) => void;
  updateAbout: (about: Partial<PortfolioData['about']>) => void;
  updateCta: (cta: Partial<PortfolioData['cta']>) => void;
  updateContact: (contact: Partial<PortfolioData['contact']>) => void;
  updateTrustStrip: (items: string[]) => void;
  // Services
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  updateService: (id: string, service: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  // Projects
  addProject: (project: Omit<ProjectItem, 'id'>) => void;
  updateProject: (id: string, project: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;
  // Tools
  updateTools: (tools: ToolItem[]) => void;
  // Reset / Import / Export
  resetToDefault: () => void;
  importJson: (jsonString: string) => boolean;
  exportJson: () => string;
}

const STORAGE_KEY = 'ibrahim_portfolio_data_v1';

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...initialPortfolioData, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load portfolio data from storage, using defaults', e);
    }
    return initialPortfolioData;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to persist portfolio data to localStorage', e);
    }
  }, [data]);

  const updateProfile = (profile: Partial<PortfolioData['profile']>) => {
    setData((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...profile }
    }));
  };

  const updateHero = (hero: Partial<PortfolioData['hero']>) => {
    setData((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...hero }
    }));
  };

  const updateAbout = (about: Partial<PortfolioData['about']>) => {
    setData((prev) => ({
      ...prev,
      about: { ...prev.about, ...about }
    }));
  };

  const updateCta = (cta: Partial<PortfolioData['cta']>) => {
    setData((prev) => ({
      ...prev,
      cta: { ...prev.cta, ...cta }
    }));
  };

  const updateContact = (contact: Partial<PortfolioData['contact']>) => {
    setData((prev) => ({
      ...prev,
      contact: { ...prev.contact, ...contact }
    }));
  };

  const updateTrustStrip = (items: string[]) => {
    setData((prev) => ({
      ...prev,
      trustStrip: items
    }));
  };

  const addService = (newService: Omit<ServiceItem, 'id'>) => {
    const id = 'svc-' + Date.now();
    setData((prev) => ({
      ...prev,
      services: [...prev.services, { ...newService, id }]
    }));
  };

  const updateService = (id: string, updated: Partial<ServiceItem>) => {
    setData((prev) => ({
      ...prev,
      services: prev.services.map((s) => (s.id === id ? { ...s, ...updated } : s))
    }));
  };

  const deleteService = (id: string) => {
    setData((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.id !== id)
    }));
  };

  const addProject = (newProject: Omit<ProjectItem, 'id'>) => {
    const id = 'proj-' + Date.now();
    setData((prev) => ({
      ...prev,
      projects: [...prev.projects, { ...newProject, id }]
    }));
  };

  const updateProject = (id: string, updated: Partial<ProjectItem>) => {
    setData((prev) => {
      const newProjects = prev.projects.map((p) => (p.id === id ? { ...p, ...updated } : p));
      return {
        ...prev,
        projects: newProjects
      };
    });

    if (selectedProject && selectedProject.id === id) {
      setSelectedProject((prev) => (prev ? { ...prev, ...updated } : null));
    }
  };

  const deleteProject = (id: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id)
    }));
    if (selectedProject && selectedProject.id === id) {
      setSelectedProject(null);
    }
  };

  const updateTools = (tools: ToolItem[]) => {
    setData((prev) => ({
      ...prev,
      tools
    }));
  };

  const resetToDefault = () => {
    setData(initialPortfolioData);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const exportJson = () => {
    return JSON.stringify(data, null, 2);
  };

  const importJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object' && parsed.profile && parsed.hero) {
        setData({
          ...initialPortfolioData,
          ...parsed
        });
        return true;
      }
      return false;
    } catch (e) {
      console.error('Invalid JSON structure for portfolio', e);
      return false;
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isAdminOpen,
        setIsAdminOpen,
        selectedProject,
        setSelectedProject,
        updateProfile,
        updateHero,
        updateAbout,
        updateCta,
        updateContact,
        updateTrustStrip,
        addService,
        updateService,
        deleteService,
        addProject,
        updateProject,
        deleteProject,
        updateTools,
        resetToDefault,
        exportJson,
        importJson
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
