import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Instagram, Linkedin, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative w-full pt-4 pb-10 px-3 sm:px-6 md:px-8 max-w-[1440px] mx-auto">
      {/* Dark Slate-Blue Rounded Block */}
      <div className="relative w-full bg-[#1B2A44] rounded-[24px] sm:rounded-[32px] overflow-hidden p-6 sm:p-10 md:p-14 text-white shadow-2xl flex flex-col justify-between">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-white/10">
          {/* Brand & Mission */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="font-display font-bold text-2xl sm:text-3xl tracking-tighter text-white block">
              Avenue
            </Link>
            <p className="font-body text-xs sm:text-sm text-white/70 max-w-sm leading-relaxed">
              Advisors for architectural residences and family sanctuaries in Pakistan. Bridging monumental design with clear titles and lasting peace of mind.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="#instagram"
                aria-label="Instagram"
                onClick={(e) => e.preventDefault()}
                className="w-8 h-8 rounded-full glass-card-subtle flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#linkedin"
                aria-label="LinkedIn"
                onClick={(e) => e.preventDefault()}
                className="w-8 h-8 rounded-full glass-card-subtle flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#twitter"
                aria-label="Twitter / X"
                onClick={(e) => e.preventDefault()}
                className="w-8 h-8 rounded-full glass-card-subtle flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-[11px] font-display uppercase tracking-widest text-white/50 block">
              Navigation
            </span>
            <ul className="space-y-2 text-xs sm:text-sm font-body">
              <li>
                <Link to="/" className="text-white/80 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/80 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-white/80 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-white/80 hover:text-white transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/buy" className="text-white/80 hover:text-white transition-colors">
                  Buy
                </Link>
              </li>
              <li>
                <Link to="/rent" className="text-white/80 hover:text-white transition-colors">
                  Rent
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/80 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-[11px] font-display uppercase tracking-widest text-white/50 block">
              Head Office
            </span>
            <div className="space-y-2 text-xs sm:text-sm text-white/80 font-body">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-white/60 shrink-0 mt-0.5" />
                <span>Main Boulevard, Phase 6, DHA Lahore</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-white/60 shrink-0" />
                <span>advisory@avenue.pk</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-white/60 shrink-0" />
                <span>+92 42 3578 9200 / +92 51 265 4100</span>
              </div>
              <div className="pt-1">
                <a
                  href="https://wa.me/923008452100?text=Assalam%20o%20Alaikum%2C%20I%20am%20inquiring%20about%20Avenue%20Luxury%20Properties."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-display text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <span>Chat on WhatsApp: +92 300 8452100</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Giant Subtle "AVENUE" Watermark along bottom */}
        <div className="relative pt-8 flex flex-col items-center justify-center overflow-hidden">
          <div className="w-full flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/60 font-body mb-6 z-10 gap-3">
            <span>© Avenue 2025. All Rights Reserved.</span>
            <div className="flex items-center gap-4">
              <span className="hover:text-white transition-colors cursor-pointer">
                Privacy Notice
              </span>
              <span>·</span>
              <span className="hover:text-white transition-colors cursor-pointer">
                Terms of Representation
              </span>
              <span>·</span>
              <span className="hover:text-white transition-colors cursor-pointer">
                Legal Disclosures
              </span>
            </div>
          </div>

          <div className="w-full flex justify-center pointer-events-none select-none opacity-20 hover:opacity-30 transition-opacity overflow-hidden z-0">
            <span
              className="font-display font-black leading-none uppercase tracking-tighter text-center text-white/60 select-none"
              style={{ fontSize: 'clamp(4rem, 12vw, 7.5rem)' }}
            >
              AVENUE
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
