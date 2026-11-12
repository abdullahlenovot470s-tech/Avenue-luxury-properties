import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

interface ServicesSectionProps {
  onOpenConsultation: (serviceTitle?: string) => void;
}

interface ServiceCardData {
  number: string;
  title: string;
  description: string;
  locationLabel: string;
  image: string;
}

const SERVICE_CARDS: ServiceCardData[] = [
  {
    number: '01',
    title: 'Buy a Home or Plot',
    description:
      'We help you find verified houses, apartments and plots in trusted societies, negotiate a fair price and complete the society and legal checks.',
    locationLabel: 'DHA LAHORE',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=70',
  },
  {
    number: '02',
    title: 'Rental & Property Management',
    description:
      'We find reliable tenants, collect rent on time and look after maintenance, so your property stays in good condition while you are away.',
    locationLabel: 'BAHRIA TOWN ISLAMABAD',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=70',
  },
  {
    number: '03',
    title: 'Investment, Resale & Registry',
    description:
      'Get advice on where to invest, sell at the right price, and complete registry, transfer and possession without stress.',
    locationLabel: 'CLIFTON KARACHI',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=70',
  },
];

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenConsultation }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleImgError = (num: string) => {
    setImgErrors((prev) => ({ ...prev, [num]: true }));
  };

  return (
    <section
      id="services-section"
      className="relative w-full py-6 sm:py-8 px-3 sm:px-6 md:px-8 max-w-[1440px] mx-auto"
    >
      {/* Dark Slate-Blue Rounded Card Container */}
      <div className="relative w-full bg-[#2F4B73] rounded-[1.75rem] sm:rounded-[2.25rem] overflow-hidden p-6 sm:p-10 md:p-12 text-white shadow-2xl">
        {/* Decorative Ambient Subtle Glow */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#1B2A44]/60 rounded-full blur-3xl pointer-events-none" />

        {/* Header Row: Title on the left, Short paragraph on the right */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 pb-8 sm:pb-10 border-b border-white/15 items-end">
          <div className="lg:col-span-6">
            <span className="text-[0.75rem] font-display uppercase tracking-widest text-white/70 block mb-2 font-medium">
              End-to-End Property Advisory
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-white leading-tight">
              WHAT WE OFFER
            </h2>
          </div>

          <div className="lg:col-span-6">
            <p className="font-body text-sm sm:text-base leading-relaxed text-white/85 font-light max-w-xl">
              From the first site visit to registry and possession, Avenue guides you through every step of buying, renting and investing in property.
            </p>
          </div>
        </div>

        {/* 
          Three Image-Led Cards:
          Desktop: three cards side by side, equal height (min-h-[32rem]), rounded-3xl, gap-4.
          Hover: card grows wider (flex-[1.4] vs flex-1), photo scales to 105%, description & LEARN MORE button fade in.
          Mobile: cards stack vertically, min-h-[26rem], description always visible.
        */}
        <div className="relative z-10 pt-8 flex flex-col lg:flex-row gap-4 items-stretch">
          {SERVICE_CARDS.map((card, idx) => {
            const isHovered = hoveredIdx === idx;
            const hasError = !!imgErrors[card.number];

            return (
              <div
                key={card.number}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => onOpenConsultation(card.title)}
                className={`group relative rounded-3xl overflow-hidden shadow-xl border border-white/20 cursor-pointer min-h-[26rem] lg:min-h-[32rem] flex flex-col justify-between p-6 sm:p-7 transition-all duration-500 ease-out ${
                  hoveredIdx !== null
                    ? isHovered
                      ? 'lg:flex-[1.4] ring-2 ring-white/40'
                      : 'lg:flex-[0.8] opacity-90'
                    : 'flex-1'
                }`}
              >
                {/* 1. PHOTO FILLS THE WHOLE CARD (absolute inset-0 w-full h-full object-cover) */}
                {!hasError ? (
                  <img
                    src={card.image}
                    alt={card.title}
                    width={800}
                    height={600}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={() => handleImgError(card.number)}
                    className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none transition-transform duration-700 ease-out group-hover:scale-105 z-0"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#1B2A44] to-[#2F4B73] flex items-center justify-center text-white/50 z-0">
                    <span className="text-xs font-display uppercase tracking-widest">{card.title}</span>
                  </div>
                )}

                {/* 2. GRADIENT: transparent to #1B2A44/90 from middle to bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B2A44]/95 via-[#1B2A44]/60 to-transparent pointer-events-none z-0" />

                {/* 3. CARD TOP BAR: Huge muted numeral (01/02/03) on left, small circular arrow on right */}
                <div className="relative z-10 flex items-start justify-between">
                  <span className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white/35 group-hover:text-white/60 transition-colors leading-none select-none">
                    {card.number}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenConsultation(card.title);
                    }}
                    className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#1B2A44] transition-all duration-300 shadow-md cursor-pointer shrink-0"
                    aria-label={`Inquire about ${card.title}`}
                  >
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>

                {/* 4. CARD BOTTOM CONTENT: Title, 2-3 line description, glass location label, learn more */}
                <div className="relative z-10 flex flex-col space-y-3 pt-8">
                  {/* Small Glass Location Label */}
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full text-[0.72rem] font-display uppercase tracking-widest text-white/90 glass-panel border border-white/20 font-semibold">
                      {card.locationLabel}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-white group-hover:text-amber-200 transition-colors leading-snug">
                    {card.title}
                  </h3>

                  {/* 2-3 line description (always visible on mobile, smooth expand on desktop) */}
                  <p className="font-body text-xs sm:text-sm text-white/85 leading-relaxed font-light line-clamp-3">
                    {card.description}
                  </p>

                  {/* Desktop Hover Pill: LEARN MORE */}
                  <div className="pt-2 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#1B2A44] font-display font-bold text-[0.72rem] uppercase tracking-wider shadow-md hover:bg-[#E6ECF5] transition-all opacity-95 group-hover:opacity-100 group-hover:translate-y-0">
                      <span>Learn More</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
