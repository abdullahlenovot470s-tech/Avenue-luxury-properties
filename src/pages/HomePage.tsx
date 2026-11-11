import React from 'react';
import { Hero } from '../components/Hero';
import { Approach } from '../components/Approach';
import { Portfolio } from '../components/Portfolio';
import { ServicesSection } from '../components/ServicesSection';
import { PickHome } from '../components/PickHome';
import { ContactCta } from '../components/ContactCta';
import { PropertyListing, PortfolioProject } from '../types';

interface HomePageProps {
  onOpenConsultation: (service?: string) => void;
  onSelectProperty: (property: PropertyListing | PortfolioProject) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenConsultation,
  onSelectProperty,
}) => {
  React.useEffect(() => {
    document.title = 'Avenue | Luxury Properties & Architectural Legacies';
  }, []);

  return (
    <div className="w-full flex flex-col space-y-4 sm:space-y-6">
      {/* 1. HERO */}
      <Hero onOpenConsultation={() => onOpenConsultation('Executive Consultation')} />

      {/* 2. THE AVENUE APPROACH */}
      <Approach onOpenConsultation={() => onOpenConsultation('Avenue Approach Consultation')} />

      {/* 3. SIGNATURE PORTFOLIO */}
      <Portfolio
        onSelectProject={onSelectProperty}
        onOpenConsultation={() => onOpenConsultation('Signature Portfolio Access')}
      />

      {/* 4. WHAT WE OFFER */}
      <ServicesSection onOpenConsultation={onOpenConsultation} />

      {/* 5. PICK YOUR PERFECT HOME */}
      <PickHome onSelectProperty={onSelectProperty} />

      {/* 6. LET'S TALK (CTA) */}
      <ContactCta />
    </div>
  );
};
