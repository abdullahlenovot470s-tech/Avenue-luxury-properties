import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HERO_ASSETS, HERO_STATS } from '../data/realEstateData';
import localHeroImg from '../assets/images/hero_luxury_villa_dusk_1794379157123.jpg';
import { PillButton } from './common/PillButton';

interface HeroProps {
  onOpenConsultation: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenConsultation }) => {
  const [heroSrc, setHeroSrc] = useState(HERO_ASSETS.heroImage);

  const handleHeroImgError = () => {
    if (heroSrc !== localHeroImg) {
      setHeroSrc(localHeroImg);
    }
  };

  return (
    <section
      id="hero"
      className="relative w-full pt-2 pb-5 px-3 sm:px-6 md:px-8 max-w-[1440px] mx-auto"
    >
      {/* 
        Hero Card:
        relative, min-h-[34rem] md:min-h-[85svh] max-h-[760px], flex flex-col justify-end, padding p-5 sm:p-8 md:p-10.
        All content sits in normal document flow inside this card.
      */}
      <div className="relative w-full min-h-[34rem] md:min-h-[85svh] max-h-[760px] rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-2xl flex flex-col justify-end p-5 sm:p-8 md:p-10 text-white">
        {/*
          1. HERO PHOTO AS BACKGROUND LAYER:
          absolute inset-0 w-full h-full object-cover, object-position: 65% center.
          Modern luxury villa at dusk with OPEN SKY above roofline, house placed centre-right.
          Subtle parallax scale transition on mount.
        */}
        <motion.img
          src={heroSrc}
          alt="Modern luxury architectural villa with open dusk sky"
          referrerPolicy="no-referrer"
          onError={handleHeroImgError}
          initial={{ scale: 1.03 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0"
          style={{ objectPosition: '65% center' }}
        />

        {/*
          2. GIANT "AVENUE" WATERMARK:
          Placed safely in the sky area ABOVE the roofline, below the navbar.
          top-28 sm:top-32 md:top-36, z-0, overflow-hidden, pointer-events-none,
          size clamp(2.75rem, 8.5vw, 6.5rem) with soft fade at bottom.
          Never overlaps the navbar or the building!
        */}
        <div className="absolute inset-x-0 top-28 sm:top-32 md:top-36 pointer-events-none select-none overflow-hidden flex justify-center z-0 px-4">
          <span
            className="font-display font-bold uppercase tracking-tighter text-center"
            style={{
              fontSize: 'clamp(2.75rem, 8.5vw, 6.5rem)',
              lineHeight: 0.9,
              background:
                'linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.03) 80%, transparent 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            AVENUE
          </span>
        </div>

        {/*
          3. GRADIENTS:
          a) Left-to-right: from-[#1B2A44]/85 via-[#1B2A44]/40 to-transparent
             Keeps text readable on the left while the house stays bright and clear on the right.
          b) Short bottom gradient: from transparent to #1B2A44/70.
          No solid or grey panels!
        */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B2A44]/85 via-[#1B2A44]/40 to-transparent pointer-events-none z-0" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#1B2A44]/70 to-transparent pointer-events-none z-0" />

        {/* Flexible spacer ensuring document flow separation from top bar */}
        <div className="w-full h-20 sm:h-24 shrink-0 flex-1" />

        {/*
          4. CONTENT IN NORMAL DOCUMENT FLOW (Z-20):
          Desktop: text block bottom-left (max 45% width), stat cards bottom-right,
          both in the same row (flex-row justify-between items-end),
          with plenty of empty space around the house.
          Mobile: text first, then stat cards side by side (grid-cols-2 gap-3).
        */}
        <div className="relative z-20 w-full flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-10">
          {/* Left: Text Block (Max 45% Width on Desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:max-w-[45%]"
          >
            {/* Headline: clamp(1.6rem, 3.2vw, 2.75rem), line-height 1.05 */}
            <h1
              className="font-display font-bold uppercase tracking-tight text-white max-w-[560px]"
              style={{
                fontSize: 'clamp(1.6rem, 3.2vw, 2.75rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
              }}
            >
              DISCOVER YOUR ARCHITECTURAL LEGACY.
            </h1>

            {/* Description: clamp(0.95rem, 1.1vw, 1.05rem), max-w-md, max 2 lines, colour white/80, mt-3 */}
            <p
              className="mt-3 font-body text-white/80 font-light leading-relaxed max-w-md line-clamp-2"
              style={{
                fontSize: 'clamp(0.95rem, 1.1vw, 1.05rem)',
              }}
            >
              Premium residences built for monumental lives, bringing modern architecture and complete peace of mind to Pakistan's most distinguished addresses.
            </p>

            {/* ONE primary CONSULTATION pill button: mt-5, py-2.5 px-5 */}
            <div className="mt-5">
              <PillButton
                variant="white"
                size="md"
                className="!text-xs sm:!text-sm !py-2.5 !px-5"
                onClick={onOpenConsultation}
              >
                Consultation
              </PillButton>
            </div>
          </motion.div>

          {/* Right: Two Compact Stat Cards Side by Side (Does not cover the house) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="grid grid-cols-2 sm:flex sm:flex-row gap-3 shrink-0"
          >
            {HERO_STATS.map((stat) => (
              <div
                key={stat.value}
                onClick={onOpenConsultation}
                className="p-3.5 sm:p-4 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 text-white min-w-[130px] sm:min-w-[145px] cursor-pointer hover:bg-white/15 transition-all shadow-md group"
              >
                {/* Stat Number: clamp(1.3rem, 2.2vw, 1.85rem) */}
                <div
                  className="font-display font-bold tracking-tight text-white group-hover:scale-105 transition-transform"
                  style={{
                    fontSize: 'clamp(1.3rem, 2.2vw, 1.85rem)',
                    lineHeight: 1.1,
                  }}
                >
                  {stat.value}
                </div>

                {/* Single line label: text-[11px] uppercase tracking-wider, no long paragraph */}
                <div className="mt-1 text-[11px] uppercase tracking-wider font-display font-medium text-white/80 whitespace-nowrap">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
