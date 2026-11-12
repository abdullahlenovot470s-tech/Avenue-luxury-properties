import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { PROPERTY_LISTINGS, PORTFOLIO_PROJECTS } from '../data/realEstateData';
import { SafeImage } from '../components/common/SafeImage';
import { PillButton } from '../components/common/PillButton';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Search, Heart, MapPin, Bed, Bath, Maximize2, ArrowUpRight } from 'lucide-react';

interface UnifiedProject {
  id: string;
  name: string;
  location: string;
  price: string;
  numericPrice: number;
  beds: number;
  baths: number;
  sqft: string;
  category: 'Lahore' | 'Islamabad' | 'Karachi' | 'Rawalpindi' | 'Murree & Hills';
  image: string;
  architect: string;
  description: string;
  yearBuilt: number | string;
}

export const ProjectsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-desc' | 'price-asc'>('featured');

  const { isPropertySaved, toggleSaveProperty } = useAuth();
  const { showToast } = useToast();

  // Combine both portfolio items and property listings for an exhaustive catalog
  const allProjects: UnifiedProject[] = useMemo(() => {
    const listA: UnifiedProject[] = PROPERTY_LISTINGS.map((p) => ({
      id: p.id,
      name: p.name,
      location: p.location,
      price: p.price,
      numericPrice: p.numericPrice,
      beds: p.beds,
      baths: p.baths,
      sqft: p.sqft,
      category: p.category,
      image: p.exteriorImage,
      architect: p.architect || p.architecturalStyle,
      description: p.description,
      yearBuilt: p.yearBuilt,
    }));

    const listB: UnifiedProject[] = PORTFOLIO_PROJECTS.map((p) => {
      // Calculate numeric price for sorting
      let num = 350000000;
      if (p.valuation.includes('Crore')) {
        const val = parseFloat(p.valuation.replace(/[^0-9.]/g, ''));
        num = val * 10000000;
      }
      return {
        id: p.id,
        name: p.title,
        location: p.location,
        price: p.valuation,
        numericPrice: num,
        beds: p.beds,
        baths: p.baths,
        sqft: p.size,
        category: p.category,
        image: p.image,
        architect: p.architect,
        description: p.summary,
        yearBuilt: p.projectDelivered,
      };
    });

    return [...listA, ...listB];
  }, []);

  const categories = ['All', 'Lahore', 'Islamabad', 'Karachi', 'Rawalpindi', 'Murree & Hills'];

  const filteredProjects = useMemo(() => {
    return allProjects
      .filter((p) => {
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.architect.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-desc') return b.numericPrice - a.numericPrice;
        if (sortBy === 'price-asc') return a.numericPrice - b.numericPrice;
        return 0;
      });
  }, [allProjects, selectedCategory, searchQuery, sortBy]);

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

  useEffect(() => {
    document.title = 'Signature Projects | Avenue Luxury Properties';
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-3 sm:px-6 md:px-8 max-w-[1440px] mx-auto space-y-6">
      {/* Breadcrumb Navigation: Home / Projects */}
      <nav aria-label="Breadcrumb" className="px-2">
        <ol className="flex items-center gap-2 text-xs font-display uppercase tracking-widest text-slate-500">
          <li>
            <Link to="/" className="hover:text-[#1B2A44] transition-colors">
              Home
            </Link>
          </li>
          <li>
            <span className="text-slate-400">/</span>
          </li>
          <li className="text-[#1B2A44] font-bold" aria-current="page">
            Projects
          </li>
        </ol>
      </nav>

      {/* Header Banner with Ghost Watermark "PROJECTS" */}
      <section className="relative w-full bg-white rounded-[24px] sm:rounded-[32px] overflow-hidden p-6 sm:p-10 md:p-14 shadow-xl border border-slate-100">
        <div className="absolute top-4 right-0 pointer-events-none select-none overflow-hidden max-w-full z-0">
          <span
            className="font-display font-black leading-none uppercase tracking-tighter text-[#E2E8F0]/30 select-none"
            style={{ fontSize: 'clamp(4rem, 12vw, 7.5rem)' }}
          >
            PROJECTS
          </span>
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="text-[11px] font-display uppercase tracking-widest text-[#2F4B73] font-bold block">
            Signature Architectural Portfolio
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl text-[#1B2A44] uppercase tracking-tight leading-none">
            SIGNATURE PROJECTS.
          </h1>
          <p className="font-body text-sm sm:text-base text-[#1B2A44]/80 leading-relaxed font-light">
            Discover residential works created by Pakistan's leading architects, licensed engineers, and master builders.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="relative z-10 pt-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-slate-100 mt-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-display text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#1B2A44] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box & Sort */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search city, architect..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-full border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:border-[#2F4B73] focus:bg-white transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full sm:w-auto px-3.5 py-2 rounded-full border border-slate-200 bg-slate-50 text-xs text-slate-700 font-display uppercase tracking-wider focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
            </select>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-display uppercase tracking-widest text-slate-500 font-semibold">
            Showing {filteredProjects.length} Available Residences
          </span>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project) => {
              const saved = isPropertySaved(project.id);

              return (
                <div
                  key={project.id}
                  className="bg-white rounded-[28px] sm:rounded-3xl overflow-hidden shadow-lg border border-slate-100 flex flex-col justify-between group hover:shadow-2xl transition-all duration-300"
                >
                  {/* Photo with Heart Save Button & Category - fixed 4/3 aspect ratio */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <SafeImage
                      src={project.image}
                      alt={project.name}
                      width={800}
                      height={600}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />

                    <div className="absolute top-3.5 left-3.5 glass-panel-dark px-3 py-1 rounded-full text-[10px] uppercase font-display tracking-widest text-white">
                      {project.category}
                    </div>

                    {/* Heart Save Button */}
                    <button
                      onClick={(e) => handleHeartClick(e, project.id, project.name)}
                      className={`absolute top-3.5 right-3.5 w-10 h-10 rounded-full glass-panel flex items-center justify-center transition-all cursor-pointer shadow-md ${
                        saved
                          ? 'text-rose-500 fill-rose-500 bg-white/90 scale-105'
                          : 'text-white hover:text-rose-400 hover:scale-105'
                      }`}
                      aria-label="Save property to shortlist"
                      title={saved ? 'Remove from shortlist' : 'Save to shortlist'}
                    >
                      <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-[#2F4B73] font-semibold mb-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{project.location}</span>
                      </div>

                      <h3 className="font-display font-extrabold text-xl text-[#1B2A44] uppercase tracking-tight group-hover:text-[#2F4B73] transition-colors">
                        {project.name}
                      </h3>

                      <div className="font-display font-bold text-lg text-[#1B2A44] mt-1">
                        {project.price}
                      </div>

                      <p className="text-xs text-slate-700 font-medium font-body line-clamp-2 mt-2 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Specs Row */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-xs text-slate-800 font-body">
                      <span className="flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5 text-slate-500" /> {project.beds} Beds
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="w-3.5 h-3.5 text-slate-400" /> {project.baths} Baths
                      </span>
                      <span className="flex items-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5 text-slate-400" /> {project.sqft}
                      </span>
                    </div>

                    {/* Action link to /projects/:id */}
                    <Link
                      to={`/projects/${project.id}`}
                      className="w-full py-3 px-5 rounded-full bg-slate-100 hover:bg-[#1B2A44] text-[#1B2A44] hover:text-white font-display text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-between group/btn cursor-pointer"
                    >
                      <span>View Full Details</span>
                      <span className="w-6 h-6 rounded-full bg-white text-[#1B2A44] flex items-center justify-center group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-md">
            <h3 className="font-display font-bold text-lg text-[#1B2A44] uppercase">
              No Residences Match Your Search
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto font-body mt-1">
              Try adjusting your city filter or search keywords.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 px-5 py-2.5 rounded-full bg-[#1B2A44] text-white text-xs font-display uppercase tracking-wider font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
