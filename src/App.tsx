/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ScrollToTop } from './components/common/ScrollToTop';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ConsultationModal } from './components/modals/ConsultationModal';
import { PropertyDetailModal } from './components/modals/PropertyDetailModal';
import { PropertyListing, PortfolioProject } from './types';

// Code-split secondary pages for optimal initial bundle performance
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const ServicesPage = lazy(() =>
  import('./pages/ServicesPage').then((m) => ({ default: m.ServicesPage }))
);
const ProjectsPage = lazy(() =>
  import('./pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage }))
);
const ProjectDetailPage = lazy(() =>
  import('./pages/ProjectDetailPage').then((m) => ({ default: m.ProjectDetailPage }))
);
const BuyPage = lazy(() =>
  import('./pages/BuyPage').then((m) => ({ default: m.BuyPage }))
);
const BuyDetailPage = lazy(() =>
  import('./pages/BuyDetailPage').then((m) => ({ default: m.BuyDetailPage }))
);
const RentPage = lazy(() =>
  import('./pages/RentPage').then((m) => ({ default: m.RentPage }))
);
const RentDetailPage = lazy(() =>
  import('./pages/RentDetailPage').then((m) => ({ default: m.RentDetailPage }))
);
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage }))
);
const LoginPage = lazy(() =>
  import('./pages/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const SignupPage = lazy(() =>
  import('./pages/SignupPage').then((m) => ({ default: m.SignupPage }))
);
const ProfilePage = lazy(() =>
  import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage }))
);

// High-fidelity fallback during lazy chunk load
function PageLoadingFallback() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative w-12 h-12 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-[#1B2A44]/20 border-t-[#1B2A44] animate-spin" />
        <span className="absolute font-display font-black text-xs text-[#1B2A44]">A</span>
      </div>
      <span className="font-display uppercase tracking-widest text-xs font-semibold text-[#2F4B73]">
        Loading Avenue Residence...
      </span>
    </div>
  );
}

function AnimatedAppContent() {
  const location = useLocation();

  // Consultation and Property Modal states
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('Residential Acquisition Strategy');
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | PortfolioProject | null>(null);
  const [propertyModalOpen, setPropertyModalOpen] = useState(false);

  const handleOpenConsultation = (serviceTitle?: string) => {
    if (serviceTitle) {
      setSelectedService(serviceTitle);
    }
    setConsultationOpen(true);
  };

  const handleSelectProperty = (prop: PropertyListing | PortfolioProject) => {
    setSelectedProperty(prop);
    setPropertyModalOpen(true);
  };

  const handleBookViewing = (propertyName: string) => {
    setSelectedService(`Private Site Visit: ${propertyName}`);
    setConsultationOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#E6ECF5] text-[#1B2A44] selection:bg-[#2F4B73] selection:text-white antialiased flex flex-col justify-between">
      <ScrollToTop />

      {/* Shared Persistent Navbar across all pages */}
      <Navbar />

      {/* Animated Route Transitions */}
      <main className="flex-1 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
          >
            <Suspense fallback={<PageLoadingFallback />}>
              <Routes location={location}>
                <Route
                  path="/"
                  element={
                    <HomePage
                      onOpenConsultation={handleOpenConsultation}
                      onSelectProperty={handleSelectProperty}
                    />
                  }
                />
                <Route
                  path="/about"
                  element={<AboutPage onOpenConsultation={handleOpenConsultation} />}
                />
                <Route
                  path="/services"
                  element={<ServicesPage onOpenConsultation={handleOpenConsultation} />}
                />
                {/* Projects (Signature Architectural Projects) */}
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:id" element={<ProjectDetailPage />} />

                {/* Buy (Properties for Sale) */}
                <Route path="/buy" element={<BuyPage />} />
                <Route path="/buy/:id" element={<BuyDetailPage />} />

                {/* Rent (Homes for Rent Placeholder) */}
                <Route path="/rent" element={<RentPage />} />
                <Route path="/rent/:id" element={<RentDetailPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route
                  path="*"
                  element={
                    <HomePage
                      onOpenConsultation={handleOpenConsultation}
                      onSelectProperty={handleSelectProperty}
                    />
                  }
                />
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Shared Footer across all pages */}
      <Footer />

      {/* Interactive Modals */}
      <ConsultationModal
        isOpen={consultationOpen}
        onClose={() => setConsultationOpen(false)}
        defaultService={selectedService}
      />

      <PropertyDetailModal
        isOpen={propertyModalOpen}
        property={selectedProperty}
        onClose={() => setPropertyModalOpen(false)}
        onBookViewing={handleBookViewing}
      />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <ToastProvider>
          <AnimatedAppContent />
        </ToastProvider>
      </AuthProvider>
    </HashRouter>
  );
}
