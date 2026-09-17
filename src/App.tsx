/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { TrustStrip } from './components/sections/TrustStrip';
import { ServicesSection } from './components/sections/ServicesSection';
import { HowIWorkSection } from './components/sections/HowIWorkSection';
import { PortfolioSection } from './components/sections/PortfolioSection';
import { ToolsSection } from './components/sections/ToolsSection';
import { AboutSection } from './components/sections/AboutSection';
import { CtaSection } from './components/sections/CtaSection';
import { ContactSection } from './components/sections/ContactSection';
import { Footer } from './components/layout/Footer';
import { ProjectCaseStudyModal } from './components/modals/ProjectCaseStudyModal';
import { AdminDashboardModal } from './admin/AdminDashboardModal';
import { FadeInSection } from './components/common/FadeInSection';

export default function App() {
  return (
    <PortfolioProvider>
      <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-300 font-sans">
        {/* Sticky Modern Navbar */}
        <Navbar />

        {/* Main Content Sections */}
        <main className="flex-1">
          {/* 1. Hero Section */}
          <FadeInSection direction="fade">
            <HeroSection />
          </FadeInSection>

          {/* 2. Trust / Capabilities Strip */}
          <FadeInSection delay={100}>
            <TrustStrip />
          </FadeInSection>

          {/* 3. Services Section */}
          <FadeInSection delay={100}>
            <ServicesSection />
          </FadeInSection>

          {/* 4. How I Work Section */}
          <FadeInSection delay={100}>
            <HowIWorkSection />
          </FadeInSection>

          {/* 5. Selected Work / Portfolio Section */}
          <FadeInSection delay={100}>
            <PortfolioSection />
          </FadeInSection>

          {/* 6. Tools & Technology Section */}
          <FadeInSection delay={100}>
            <ToolsSection />
          </FadeInSection>

          {/* 7. About Section */}
          <FadeInSection delay={100}>
            <AboutSection />
          </FadeInSection>

          {/* 8. Call To Action Section */}
          <FadeInSection delay={100}>
            <CtaSection />
          </FadeInSection>

          {/* 9. Contact Section */}
          <FadeInSection delay={100}>
            <ContactSection />
          </FadeInSection>
        </main>

        {/* Footer */}
        <Footer />

        {/* Detailed Case Study Modal */}
        <ProjectCaseStudyModal />

        {/* Admin / Content Management Modal */}
        <AdminDashboardModal />
      </div>
    </PortfolioProvider>
  );
}
