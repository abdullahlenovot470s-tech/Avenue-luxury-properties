import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { PROPERTY_LISTINGS } from '../data/realEstateData';
import { PropertyListing } from '../types';
import { SafeImage } from './common/SafeImage';
import { PillButton } from './common/PillButton';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Bed, Bath, Maximize2, MapPin, Heart, ArrowUpRight } from 'lucide-react';

interface PickHomeProps {
  onSelectProperty: (property: PropertyListing) => void;
}

export const PickHome: React.FC<PickHomeProps> = ({ onSelectProperty }) => {
  const { isPropertySaved, toggleSaveProperty } = useAuth();
  const { showToast } = useToast();

  const handleHeartClick = (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    const isNowSaved = toggleSaveProperty(id);
    if (isNowSaved) {
      showToast(`Saved "${name}" to your shortlist.`, 'success');
    } else {
      showToast(`Removed "${name}" from shortlist.`, 'info');
    }
  };

  return (
    <section
      id="residences"
      className="relative w-full py-6 sm:py-10 px-3 sm:px-6 md:px-8 max-w-[1440px] mx-auto"
    >
      {/* White Section Card */}
      <div className="relative w-full bg-white rounded-[24px] sm:rounded-[32px] overflow-hidden p-6 sm:p-8 md:p-12 shadow-xl border border-slate-100">
        {/* Section Title */}
        <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-display uppercase tracking-widest text-[#1B2A44]/60 block mb-2">
              Verified Premium Residences
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-[2rem] text-[#1B2A44] uppercase tracking-tight">
              PICK YOUR PERFECT HOME
            </h2>
          </div>

          <Link
            to="/projects"
            className="text-xs font-display uppercase tracking-wider text-[#1B2A44] hover:text-[#2F4B73] font-bold flex items-center gap-1.5"
          >
            <span>VIEW ALL PROPERTIES</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Three Property Rows */}
        <div className="space-y-12 sm:space-y-16 divide-y divide-slate-100">
          {PROPERTY_LISTINGS.slice(0, 3).map((property) => {
            const isMirrored = property.layoutVariant === 'exterior-right';
            const saved = isPropertySaved(property.id);

            return (
              <div
                key={property.id}
                className="pt-12 sm:pt-16 first:pt-0 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center"
              >
                {/* Exterior & Interior Image Composition */}
                <div
                  className={`lg:col-span-8 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 ${
                    isMirrored ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  {isMirrored ? (
                    <>
                      {/* Mirrored: Two 4/3 Interiors on Left */}
                      <div className="sm:col-span-3 aspect-[4/3] sm:aspect-auto sm:h-full rounded-2xl overflow-hidden shadow-md group border border-slate-200">
                        <SafeImage
                          src={property.interiorImages[0]}
                          alt={`${property.name} interior detail 1`}
                          width={800}
                          height={600}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="sm:col-span-3 aspect-[4/3] sm:aspect-auto sm:h-full rounded-2xl overflow-hidden shadow-md group border border-slate-200">
                        <SafeImage
                          src={property.interiorImages[1]}
                          alt={`${property.name} interior detail 2`}
                          width={800}
                          height={600}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      {/* Exterior on Right with Heart Button - 4/3 aspect ratio */}
                      <div className="sm:col-span-6 aspect-[4/3] rounded-2xl overflow-hidden shadow-lg group border border-slate-200 relative">
                        <SafeImage
                          src={property.exteriorImage}
                          alt={`${property.name} architectural exterior`}
                          width={800}
                          height={600}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-3 right-3 glass-panel-dark px-3 py-1 rounded-full text-[10px] uppercase font-display tracking-widest text-white">
                          {property.architecturalStyle}
                        </div>
                        <button
                          onClick={(e) => handleHeartClick(e, property.id, property.name)}
                          className={`absolute bottom-3 right-3 w-10 h-10 rounded-full glass-panel flex items-center justify-center transition-all cursor-pointer shadow-md ${
                            saved
                              ? 'text-rose-500 fill-rose-500 bg-white/95 scale-105'
                              : 'text-white hover:text-rose-400'
                          }`}
                          title={saved ? 'Remove from shortlist' : 'Save to shortlist'}
                        >
                          <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Default: Large Exterior on Left with Heart Button - 4/3 aspect ratio */}
                      <div className="sm:col-span-6 aspect-[4/3] rounded-2xl overflow-hidden shadow-lg group border border-slate-200 relative">
                        <SafeImage
                          src={property.exteriorImage}
                          alt={`${property.name} architectural exterior`}
                          width={800}
                          height={600}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-3 left-3 glass-panel-dark px-3 py-1 rounded-full text-[10px] uppercase font-display tracking-widest text-white">
                          {property.architecturalStyle}
                        </div>
                        <button
                          onClick={(e) => handleHeartClick(e, property.id, property.name)}
                          className={`absolute bottom-3 right-3 w-10 h-10 rounded-full glass-panel flex items-center justify-center transition-all cursor-pointer shadow-md ${
                            saved
                              ? 'text-rose-500 fill-rose-500 bg-white/95 scale-105'
                              : 'text-white hover:text-rose-400'
                          }`}
                          title={saved ? 'Remove from shortlist' : 'Save to shortlist'}
                        >
                          <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      {/* Two 4/3 Interiors on Right */}
                      <div className="sm:col-span-3 aspect-[4/3] sm:aspect-auto sm:h-full rounded-2xl overflow-hidden shadow-md group border border-slate-200">
                        <SafeImage
                          src={property.interiorImages[0]}
                          alt={`${property.name} interior detail 1`}
                          width={800}
                          height={600}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="sm:col-span-3 aspect-[4/3] sm:aspect-auto sm:h-full rounded-2xl overflow-hidden shadow-md group border border-slate-200">
                        <SafeImage
                          src={property.interiorImages[1]}
                          alt={`${property.name} interior detail 2`}
                          width={800}
                          height={600}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Property Narrative & Details */}
                <div
                  className={`lg:col-span-4 flex flex-col space-y-4 ${
                    isMirrored ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs text-[#2F4B73] font-semibold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{property.location}</span>
                  </div>

                  <h3 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-[#1B2A44]">
                    {property.name}
                  </h3>

                  <div className="text-xl font-display font-bold text-[#1B2A44]">
                    {property.price}
                  </div>

                  <p className="font-body text-xs sm:text-sm text-[#1B2A44]/80 leading-relaxed">
                    {property.description}
                  </p>

                  {/* Property Specs Pill Grid */}
                  <div className="flex flex-wrap items-center gap-3 py-2 text-xs text-[#1B2A44]/80">
                    <span className="flex items-center gap-1 bg-[#E6ECF5]/60 px-3 py-1.5 rounded-lg">
                      <Bed className="w-3.5 h-3.5" /> {property.beds} Beds
                    </span>
                    <span className="flex items-center gap-1 bg-[#E6ECF5]/60 px-3 py-1.5 rounded-lg">
                      <Bath className="w-3.5 h-3.5" /> {property.baths} Baths
                    </span>
                    <span className="flex items-center gap-1 bg-[#E6ECF5]/60 px-3 py-1.5 rounded-lg">
                      <Maximize2 className="w-3.5 h-3.5" /> {property.sqft}
                    </span>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <PillButton
                      variant="dark"
                      size="sm"
                      onClick={() => onSelectProperty(property)}
                    >
                      View Details
                    </PillButton>

                    <Link
                      to={`/projects/${property.id}`}
                      className="text-xs font-display uppercase tracking-wider text-[#1B2A44] hover:text-[#2F4B73] font-semibold underline underline-offset-4"
                    >
                      Complete Details
                    </Link>
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
