import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PORTFOLIO_PROJECTS } from '../data/realEstateData';
import { PortfolioProject } from '../types';
import { SafeImage } from './common/SafeImage';
import { PillButton } from './common/PillButton';
import { ArrowLeft, ArrowRight, MapPin, Maximize2, Calendar, CheckCircle2 } from 'lucide-react';

interface PortfolioProps {
  onSelectProject: (project: PortfolioProject) => void;
  onOpenConsultation: () => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({ onSelectProject, onOpenConsultation }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeProject = PORTFOLIO_PROJECTS[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? PORTFOLIO_PROJECTS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === PORTFOLIO_PROJECTS.length - 1 ? 0 : prev + 1));
  };

  // Other projects for thumbnails
  const thumbnailProjects = PORTFOLIO_PROJECTS.map((p, idx) => ({ ...p, originalIdx: idx })).filter(
    (_, idx) => idx !== currentIndex
  );

  return (
    <section
      id="portfolio"
      className="relative w-full py-6 sm:py-10 px-3 sm:px-6 md:px-8 max-w-[1440px] mx-auto"
    >
      {/* White Section Card with Giant Watermark */}
      <div className="relative w-full bg-white rounded-[24px] sm:rounded-[32px] overflow-hidden p-6 sm:p-8 md:p-12 shadow-xl border border-slate-100">
        {/* GIANT GHOST WATERMARK WORD "PROJECTS" */}
        <div className="absolute top-6 -left-8 md:-left-12 z-0 pointer-events-none select-none overflow-hidden max-w-full">
          <span
            className="font-display font-black leading-none uppercase tracking-tighter text-[#E2E8F0]/35 select-none"
            style={{ fontSize: 'clamp(4rem, 14vw, 8rem)' }}
          >
            PROJECTS
          </span>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Featured Large Portrait Card with Glass Overlay */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5 }}
                className="relative w-full aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl group border border-slate-200"
              >
                <SafeImage
                  src={activeProject.image}
                  alt={activeProject.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />

                {/* Gradient Scrim for Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1726]/90 via-[#0e1726]/30 to-transparent" />

                {/* Glass Overlay Card at Bottom */}
                <div className="absolute inset-x-4 sm:inset-x-6 bottom-4 sm:bottom-6 glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-white/25">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-display uppercase tracking-widest text-white/70">
                      Featured Residence · {activeProject.architect}
                    </span>
                    <span className="text-xs font-display font-semibold text-emerald-300">
                      {activeProject.valuation}
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-xl sm:text-2xl lg:text-3xl uppercase tracking-tight text-white mb-3">
                    {activeProject.title}
                  </h3>

                  <div className="grid grid-cols-3 gap-2 py-3 my-2 border-y border-white/15 text-[11px] sm:text-xs text-white/80">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-white/60 shrink-0" />
                      <span className="truncate">{activeProject.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-white/60 shrink-0" />
                      <span className="truncate">{activeProject.size}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-white/60 shrink-0" />
                      <span className="truncate">Delivered {activeProject.projectDelivered}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-1">
                    <PillButton
                      variant="white"
                      size="sm"
                      onClick={() => onSelectProject(activeProject)}
                    >
                      View Details
                    </PillButton>

                    <div className="flex items-center gap-1.5 text-xs text-white/70 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Possession Ready</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Title, View All, Prev/Next Arrows, and Two Thumbnails */}
          <div className="lg:col-span-6 flex flex-col space-y-8">
            {/* Header with Title, Button & Controls */}
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#1B2A44] uppercase tracking-tight">
                  SIGNATURE PORTFOLIO
                </h2>
              </div>

              <div className="flex items-center justify-between gap-4 pt-1">
                <PillButton variant="dark" size="sm" onClick={() => navigate('/projects')}>
                  VIEW ALL PROPERTIES
                </PillButton>

                {/* Prev / Next Circular Arrow Buttons (One outlined, One filled dark) */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous portfolio item"
                    className="w-10 h-10 rounded-full border border-[#1B2A44] flex items-center justify-center text-[#1B2A44] hover:bg-[#1B2A44]/10 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next portfolio item"
                    className="w-10 h-10 rounded-full bg-[#1B2A44] flex items-center justify-center text-white hover:bg-[#2F4B73] transition-colors shadow-sm cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Two Smaller Thumbnail Project Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-2">
              {thumbnailProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setCurrentIndex(project.originalIdx)}
                  className="group relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-slate-200 cursor-pointer hover:shadow-xl transition-all duration-300"
                >
                  <SafeImage
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1B2A44]/80 via-black/20 to-transparent group-hover:from-[#1B2A44]/90 transition-colors" />

                  <div className="absolute inset-x-4 bottom-4 text-white">
                    <span className="text-[10px] font-display uppercase tracking-widest text-white/70 block">
                      {project.location}
                    </span>
                    <h4 className="font-display font-bold text-sm sm:text-base uppercase tracking-tight text-white group-hover:text-amber-200 transition-colors">
                      {project.title}
                    </h4>
                    <span className="text-[11px] text-white/80 font-body">
                      {project.size} · {project.projectDelivered}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Architectural Statement */}
            <div className="p-5 rounded-2xl bg-[#E6ECF5]/40 border border-[#E6ECF5] text-xs sm:text-[13px] text-[#1B2A44]/75 leading-relaxed font-body">
              <span className="font-semibold text-[#1B2A44]">Avenue Legal Guarantee:</span> Every residence in our signature portfolio undergoes rigorous LDA / CDA / KDA approval verification, clear fard and registry review, and structural inspection before representation.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
