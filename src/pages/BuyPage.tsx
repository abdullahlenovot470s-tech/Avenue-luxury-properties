import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BUY_PROPERTIES, BuyProperty } from '../data/buyPropertiesData';
import { SafeImage } from '../components/common/SafeImage';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Search,
  Heart,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  ArrowUpRight,
  ChevronRight,
  RotateCcw,
  Building,
} from 'lucide-react';

export const BuyPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedPrice, setSelectedPrice] = useState<string>('All');
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const { isPropertySaved, toggleSaveProperty } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    document.title = 'Properties For Sale | Avenue Luxury Properties';
  }, []);

  const cities = ['All', 'Lahore', 'Islamabad', 'Karachi', 'Rawalpindi', 'Murree & Hills'];
  const types = ['All', 'House', 'Apartment', 'Plot'];
  const priceOptions = ['All', 'Under 1 Cr', '1-3 Cr', '3-7 Cr', '7 Cr+'];
  const areaOptions = ['All', 'Up to 5 Marla', '10 Marla', '1 Kanal', '2 Kanal+'];

  const filteredProperties = useMemo(() => {
    return BUY_PROPERTIES.filter((prop) => {
      const matchCity = selectedCity === 'All' || prop.city === selectedCity;
      const matchType = selectedType === 'All' || prop.type === selectedType;
      const matchPrice = selectedPrice === 'All' || prop.priceRange === selectedPrice;
      const matchArea = selectedArea === 'All' || prop.areaCategory === selectedArea;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        prop.title.toLowerCase().includes(q) ||
        prop.location.toLowerCase().includes(q) ||
        prop.city.toLowerCase().includes(q) ||
        prop.area.toLowerCase().includes(q);

      return matchCity && matchType && matchPrice && matchArea && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-desc') return b.numericPrice - a.numericPrice;
      if (sortBy === 'price-asc') return a.numericPrice - b.numericPrice;
      return 0;
    });
  }, [selectedCity, selectedType, selectedPrice, selectedArea, searchQuery, sortBy]);

  const hasActiveFilters =
    selectedCity !== 'All' ||
    selectedType !== 'All' ||
    selectedPrice !== 'All' ||
    selectedArea !== 'All' ||
    searchQuery.trim() !== '';

  const handleClearFilters = () => {
    setSelectedCity('All');
    setSelectedType('All');
    setSelectedPrice('All');
    setSelectedArea('All');
    setSearchQuery('');
    setSortBy('featured');
    showToast('Filters cleared', 'info');
  };

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
    <div className="min-h-screen pt-24 pb-16 px-3 sm:px-6 md:px-8 max-w-[1440px] mx-auto space-y-6">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="px-2">
        <ol className="flex items-center gap-2 text-xs font-display uppercase tracking-widest text-slate-500">
          <li>
            <Link to="/" className="hover:text-[#1B2A44] transition-colors">
              Home
            </Link>
          </li>
          <li>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </li>
          <li className="text-[#1B2A44] font-bold" aria-current="page">
            Buy
          </li>
        </ol>
      </nav>

      {/* Header Banner with Ghost Watermark "BUY" */}
      <section className="relative w-full bg-white rounded-[24px] sm:rounded-[32px] overflow-hidden p-6 sm:p-10 md:p-14 shadow-xl border border-slate-100">
        <div className="absolute top-4 right-0 pointer-events-none select-none overflow-hidden max-w-full z-0">
          <span
            className="font-display font-black leading-none uppercase tracking-tighter text-[#E2E8F0]/30 select-none"
            style={{ fontSize: 'clamp(4rem, 14vw, 8.5rem)' }}
          >
            BUY
          </span>
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="text-[11px] font-display uppercase tracking-widest text-[#2F4B73] font-bold block">
            Residential Acquisitions & Plots
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl text-[#1B2A44] uppercase tracking-tight leading-none">
            PROPERTIES FOR SALE.
          </h1>
          <p className="font-body text-sm sm:text-base text-[#1B2A44]/80 leading-relaxed font-light">
            Verified houses, premium apartments, and residential plots across Lahore, Islamabad, Karachi, Rawalpindi, and Murree Hills with guaranteed clean titles.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="relative z-10 pt-10 flex flex-col gap-4 border-t border-slate-100 mt-8">
          {/* City Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-full font-display text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  selectedCity === city
                    ? 'bg-[#1B2A44] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Secondary Filters: Type, Price, Area, Search Box, Clear Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Type Dropdown */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3.5 py-2 rounded-full border border-slate-200 bg-slate-50 text-xs text-slate-700 font-display uppercase tracking-wider focus:outline-none cursor-pointer"
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type === 'All' ? 'All Types' : type}
                  </option>
                ))}
              </select>

              {/* Price Dropdown (Under 1 Cr, 1-3 Cr, 3-7 Cr, 7 Cr+) */}
              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="px-3.5 py-2 rounded-full border border-slate-200 bg-slate-50 text-xs text-slate-700 font-display uppercase tracking-wider focus:outline-none cursor-pointer"
              >
                {priceOptions.map((price) => (
                  <option key={price} value={price}>
                    {price === 'All' ? 'All Prices' : price}
                  </option>
                ))}
              </select>

              {/* Area Dropdown (Up to 5 Marla, 10 Marla, 1 Kanal, 2 Kanal+) */}
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="px-3.5 py-2 rounded-full border border-slate-200 bg-slate-50 text-xs text-slate-700 font-display uppercase tracking-wider focus:outline-none cursor-pointer"
              >
                {areaOptions.map((area) => (
                  <option key={area} value={area}>
                    {area === 'All' ? 'All Areas' : area}
                  </option>
                ))}
              </select>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="px-3 py-2 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-display uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear Filters</span>
                </button>
              )}
            </div>

            {/* Search Box & Sort */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search society, city, plot..."
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
        </div>
      </section>

      {/* Properties Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-display uppercase tracking-widest text-slate-500 font-semibold">
            Showing {filteredProperties.length} Properties for Sale
          </span>
        </div>

        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProperties.map((prop) => {
              const saved = isPropertySaved(prop.id);

              return (
                <motion.div
                  key={prop.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-[28px] sm:rounded-3xl overflow-hidden shadow-lg border border-slate-100 flex flex-col justify-between group hover:shadow-2xl transition-all duration-300"
                >
                  {/* Photo with Badges & Heart Save Button */}
                  <div className="relative aspect-[16/11] overflow-hidden">
                    <SafeImage
                      src={prop.image}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5">
                      <span className="glass-panel-dark px-3 py-1 rounded-full text-[10px] uppercase font-display tracking-widest text-white">
                        {prop.city}
                      </span>
                      <span className="glass-panel-dark px-2.5 py-1 rounded-full text-[10px] uppercase font-display tracking-widest text-emerald-300">
                        {prop.type}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleHeartClick(e, prop.id, prop.title)}
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
                        <span className="truncate">{prop.location}</span>
                      </div>

                      <h3 className="font-display font-extrabold text-xl text-[#1B2A44] uppercase tracking-tight group-hover:text-[#2F4B73] transition-colors">
                        {prop.title}
                      </h3>

                      <div className="font-display font-bold text-xl text-[#1B2A44] mt-1.5">
                        {prop.price}
                      </div>

                      <p className="text-xs text-slate-500 font-body line-clamp-2 mt-2 leading-relaxed">
                        {prop.description}
                      </p>
                    </div>

                    {/* Specs Row: Area in Marla/Kanal/Sq. Yd only, beds, baths */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-xs text-slate-600 font-body">
                      {prop.type === 'Plot' ? (
                        <>
                          <span className="col-span-2 flex items-center gap-1 font-semibold text-[#1B2A44]">
                            <Maximize2 className="w-3.5 h-3.5 text-[#2F4B73]" /> Area: {prop.area}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                            {prop.possession}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="flex items-center gap-1">
                            <Bed className="w-3.5 h-3.5 text-slate-400" /> {prop.beds} Beds
                          </span>
                          <span className="flex items-center gap-1">
                            <Bath className="w-3.5 h-3.5 text-slate-400" /> {prop.baths} Baths
                          </span>
                          <span className="flex items-center gap-1">
                            <Maximize2 className="w-3.5 h-3.5 text-slate-400" /> {prop.area}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Clickable link to /buy/:id */}
                    <Link
                      to={`/buy/${prop.id}`}
                      className="w-full py-3 px-5 rounded-full bg-slate-100 hover:bg-[#1B2A44] text-[#1B2A44] hover:text-white font-display text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-between group/btn cursor-pointer"
                    >
                      <span>View Full Details</span>
                      <span className="w-6 h-6 rounded-full bg-white text-[#1B2A44] flex items-center justify-center group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-md space-y-3">
            <Building className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-display font-bold text-lg text-[#1B2A44] uppercase">
              No Properties Match Your Filters
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto font-body">
              Try adjusting your city, property type, price bracket, or area parameters.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-2 px-5 py-2.5 rounded-full bg-[#1B2A44] text-white text-xs font-display uppercase tracking-wider font-semibold cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
