import React from 'react';
import { motion } from 'motion/react';
import { HERO_ASSETS } from '../data/realEstateData';
import { SafeImage } from './common/SafeImage';
import { PillButton } from './common/PillButton';

interface ApproachProps {
  onOpenConsultation: () => void;
}

export const Approach: React.FC<ApproachProps> = ({ onOpenConsultation }) => {
  return (
    <section
      id="approach"
      className="relative w-full py-6 sm:py-10 px-3 sm:px-6 md:px-8 max-w-[1440px] mx-auto"
    >
      {/* White Section Card with Giant Watermark */}
      <div className="relative w-full bg-white rounded-[24px] sm:rounded-[32px] overflow-hidden p-6 sm:p-8 md:p-12 shadow-xl border border-slate-100">
        {/* GIANT GHOST WATERMARK WORD "ABOUT" CUT OFF AT RIGHT */}
        <div className="absolute top-2 -right-10 md:-right-16 z-0 pointer-events-none select-none overflow-hidden max-w-full">
          <span
            className="font-display font-black leading-none uppercase tracking-tighter text-[#E2E8F0]/35 select-none"
            style={{ fontSize: 'clamp(4rem, 14vw, 8rem)' }}
          >
            ABOUT
          </span>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 flex flex-col space-y-5"
          >
            <div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-[2rem] text-[#1B2A44] uppercase tracking-tight">
                THE AVENUE APPROACH
              </h2>
            </div>

            {/* Smaller Portrait Image of a Villa with Pool */}
            <div className="relative w-full max-w-[340px] aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-slate-200/60 group">
              <SafeImage
                src={HERO_ASSETS.approachPortrait}
                alt="The Avenue approach architectural villa with pool"
                width={800}
                height={1000}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1B2A44]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white text-xs font-display uppercase tracking-wider">
                  Private Sanctuary Collection
                </span>
              </div>
            </div>

            {/* Narrative Paragraph */}
            <p className="font-body text-sm sm:text-[15px] leading-relaxed text-[#1B2A44]/90 font-normal max-w-md">
              At Avenue, we believe a home is more than a physical structure: it is the cornerstone of your family's future. We do not just list properties; we present environments that inspire. Our team combines decades of market intelligence across DHA, CDA sectors, and Bahria Town with a deep appreciation for high-end design, ensuring every registry, transfer, and possession handover is completely transparent and seamless.
            </p>

            {/* Consultation Button */}
            <div className="pt-2">
              <PillButton variant="dark" size="md" onClick={onOpenConsultation}>
                Consultation
              </PillButton>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 flex flex-col space-y-4"
          >
            {/* Small Uppercase Label */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-[2px] bg-[#1B2A44]/30" />
              <span className="font-display font-semibold text-[11px] sm:text-xs tracking-widest text-[#1B2A44]/85 uppercase">
                CRAFTING YOUR VISION INTO ADDRESSES
              </span>
            </div>

            {/* Large Rounded Image with Water-Feature Walkway at Night */}
            <div className="relative w-full aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 group">
              <SafeImage
                src={HERO_ASSETS.approachWalkway}
                alt="Luxury modern residence with illuminated water-feature reflection walkway at night"
                width={1200}
                height={900}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1B2A44]/80 via-transparent to-transparent" />

              {/* Inset Badge */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between pointer-events-none">
                <div className="glass-panel px-4 py-2 rounded-xl text-white">
                  <div className="text-[10px] uppercase font-display tracking-widest text-white/70">
                    Avenue Landmark Project
                  </div>
                  <div className="text-sm font-display font-bold text-white tracking-wide">
                    DHA Phase 6 Reflection Residence
                  </div>
                </div>
                <div className="hidden sm:block text-right">
                  <span className="text-[11px] font-display uppercase tracking-wider text-white/80 glass-card-subtle px-3 py-1.5 rounded-lg">
                    Architectural Residence
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
