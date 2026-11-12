import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { RENTAL_LISTINGS, formatRent } from '../data/rentalsData';
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

export const RentPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedBeds, setSelectedBeds] = useState<string>('All');
  const [selectedPrice, setSelectedPrice] = useState<string>('All');
  const [selectedFurnished, setSelectedFurnished] = useState<string>('Any');
  const [sortBy, setSortBy] = useState<'featured' | 'rent-asc' | 'rent-desc'>('featured');

  const { isPropertySaved, toggleSaveProperty } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Homes For Rent | Avenue Luxury Properties';
  }, []);

  const cities = ['All', 'Lahore', 'Islamabad', 'Karachi', 'Rawalpindi', 'Murree & Hills'];
  const types = ['All', 'Apartment', 'House', 'Upper Portion', 'Lower Portion'];
  const bedroomOptions = ['All', '1', '2', '3', '4+'];
  const priceOptions = ['All', 'Under 50,000', '50,000-1 Lakh', '1-2 Lakh', '2 Lakh+'];
  const furnishedOptions = ['Any', 'Furnished', 'Unfurnished'];

  const filteredListings = useMemo(() => {
    return RENTAL_LISTINGS.filter((item) => {
      // 1. City Filter
      const matchCity = selectedCity === 'All' || item.city === selectedCity;

      // 2. Type Filter
      const matchType = selectedType === 'All' || item.type.toLowerCase() === selectedType.toLowerCase();

      // 3. Bedrooms Filter (1, 2, 3, 4+)
      let matchBeds = true;
      if (selectedBeds === '1') matchBeds = item.beds === 1;
      else if (selectedBeds === '2') matchBeds = item.beds === 2;
      else if (selectedBeds === '3') matchBeds = item.beds === 3;
      else if (selectedBeds === '4+') matchBeds = item.beds >= 4;

      // 4. Rent Range Filter (Under 50,000 / 50,000-1 Lakh / 1-2 Lakh / 2 Lakh+)
      let matchPrice = true;
      if (selectedPrice === 'Under 50,000') {
        matchPrice = item.monthlyRent < 50000;
      } else if (selectedPrice === '50,000-1 Lakh') {
        matchPrice = item.monthlyRent >= 50000 && item.monthlyRent <= 100000;
      } else if (selectedPrice === '1-2 Lakh') {
        matchPrice = item.monthlyRent > 100000 && item.monthlyRent <= 200000;
      } else if (selectedPrice === '2 Lakh+') {
        matchPrice = item.monthlyRent > 200000;
      }

      // 5. Furnished Filter (Any / Furnished / Unfurnished)
      const matchFurnished =
        selectedFurnished === 'Any' ||
        item.furnished.toLowerCase() === selectedFurnished.toLowerCase();

      // 6. Search Query
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.areaSociety.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        item.sizeOrFloor.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);

      return matchCity && matchType && matchBeds && matchPrice && matchFurnished && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'rent-desc') return b.monthlyRent - a.monthlyRent;
      if (sortBy === 'rent-asc') return a.monthlyRent - b.monthlyRent;
      return 0;
    });
  }, [selectedCity, selectedType, selectedBeds, selectedPrice, selectedFurnished, searchQuery, sortBy]);

  const hasActiveFilters =
    selectedCity !== 'All' ||
    selectedType !== 'All' ||
    selectedBeds !== 'All' ||
    selectedPrice !== 'All' ||
    selectedFurnished !== 'Any' ||
    searchQuery.trim() !== '';

  const handleClearFilters = () => {
    setSelectedCity('All');
    setSelectedType('All');
    setSelectedBeds('All');
    setSelectedPrice('All');
    setSelectedFurnished('Any');
    setSearchQuery('');
    setSortBy('featured');
    showToast('Filters cleared', 'info');
  };

  const handleHeartClick = (e: React.MouseEvent, id: string, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    const isNowSaved = toggleSaveProperty(id);
    if (isNowSaved) {
      showToast(`Saved "${title}" to your shortlist.`, 'success');
    } else {
      showToast(`Removed "${title}" from shortlist.`, 'info');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-3 sm:px-6 md:px-8 max-w-[1440px] mx-auto space-y-6">
      {/* Breadcrumb Navigation: Home / Rent */}
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
            Rent
          </li>
        </ol>
      </nav>

      {/* Header Banner with Ghost Watermark "RENT" and Page Title "HOMES FOR RENT" */}
      <section className="relative w-full bg-white rounded-[24px] sm:rounded-[32px] overflow-hidden p-6 sm:p-10 md:p-14 shadow-xl border border-slate-100">
        {/* Ghost Watermark: "RENT" behind */}
        <div className="absolute top-4 right-0 pointer-events-none select-none overflow-hidden max-w-full z-0">
          <span
            className="font-display font-black leading-none uppercase tracking-tighter text-[#E2E8F0]/30 select-none"
            style={{ fontSize: 'clamp(4rem, 16vw, 9.5rem)' }}
          >
            RENT
          </span>
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="text-[11px] font-display uppercase tracking-widest text-[#2F4B73] font-bold block">
            Executive Tenancies & Leasing
          </span>
          <h1
            className="font-display font-extrabold text-[#1B2A44] uppercase tracking-tight leading-none"
            style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)' }}
          >
            HOMES FOR RENT
          </h1>
          <p className="font-body text-sm sm:text-base text-[#1B2A44]/80 leading-relaxed font-light">
            Verified apartments, houses and portions for rent in Lahore, Islamabad, Rawalpindi and Karachi.
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

          {/* Secondary Filters Row: Type, Bedrooms, Rent Range, Furnished, Clear Filters */}
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

              {/* Bedrooms Dropdown (1, 2, 3, 4+) */}
              <select
                value={selectedBeds}
                onChange={(e) => setSelectedBeds(e.target.value)}
                className="px-3.5 py-2 rounded-full border border-slate-200 bg-slate-50 text-xs text-slate-700 font-display uppercase tracking-wider focus:outline-none cursor-pointer"
              >
                {bedroomOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === 'All' ? 'All Beds' : `${opt} Bed${opt === '1' ? '' : 's'}`}
                  </option>
                ))}
              </select>

              {/* Rent Range Dropdown (Under 50,000 / 50,000-1 Lakh / 1-2 Lakh / 2 Lakh+) */}
              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="px-3.5 py-2 rounded-full border border-slate-200 bg-slate-50 text-xs text-slate-700 font-display uppercase tracking-wider focus:outline-none cursor-pointer"
              >
                {priceOptions.map((price) => (
                  <option key={price} value={price}>
                    {price === 'All' ? 'All Rent Ranges' : price}
                  </option>
                ))}
              </select>

              {/* Furnished Dropdown (Any / Furnished / Unfurnished) */}
              <select
                value={selectedFurnished}
                onChange={(e) => setSelectedFurnished(e.target.value)}
                className="px-3.5 py-2 rounded-full border border-slate-200 bg-slate-50 text-xs text-slate-700 font-display uppercase tracking-wider focus:outline-none cursor-pointer"
              >
                {furnishedOptions.map((fur) => (
                  <option key={fur} value={fur}>
                    {fur === 'Any' ? 'Any Furnishing' : fur}
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
                  placeholder="Search area, floor, society..."
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
                <option value="rent-desc">Rent: High to Low</option>
                <option value="rent-asc">Rent: Low to High</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Rentals Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-display uppercase tracking-widest text-slate-500 font-semibold">
            Showing {filteredListings.length} Homes for Rent
          </span>
        </div>

        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredListings.map((listing) => {
              const saved = isPropertySaved(listing.id);

              return (
                <div
                  key={listing.id}
                  onClick={() => navigate(`/rent/${listing.id}`)}
                  className="bg-white rounded-[28px] sm:rounded-3xl overflow-hidden shadow-lg border border-slate-100 flex flex-col justify-between group hover:shadow-2xl transition-all duration-300 cursor-pointer"
                >
                  {/* Photo filling card at fixed 4/3 ratio, glass city label, FOR RENT badge, Heart */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <SafeImage
                      src={listing.image}
                      alt={listing.title}
                      width={800}
                      height={600}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />

                    <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5">
                      <span className="glass-panel-dark px-3 py-1 rounded-full text-[10px] uppercase font-display tracking-widest text-white">
                        {listing.city}
                      </span>
                      <span className="glass-panel-dark px-2.5 py-1 rounded-full text-[10px] uppercase font-display tracking-widest text-emerald-300 font-bold">
                        FOR RENT
                      </span>
                      <span className="glass-panel-dark px-2.5 py-1 rounded-full text-[10px] uppercase font-display tracking-widest text-white/90">
                        {listing.type}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleHeartClick(e, listing.id, listing.title)}
                      className={`absolute top-3.5 right-3.5 w-10 h-10 rounded-full glass-panel flex items-center justify-center transition-all cursor-pointer shadow-md ${
                        saved
                          ? 'text-rose-500 fill-rose-500 bg-white/90 scale-105'
                          : 'text-white hover:text-rose-400 hover:scale-105'
                      }`}
                      aria-label="Save rental to shortlist"
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
                        <span className="truncate">{listing.areaSociety}</span>
                      </div>

                      <h3 className="font-display font-extrabold text-xl text-[#1B2A44] uppercase tracking-tight group-hover:text-[#2F4B73] transition-colors">
                        {listing.title}
                      </h3>

                      {/* Rent in bold via formatRent() */}
                      <div className="font-display font-bold text-xl text-[#1B2A44] mt-1.5">
                        {formatRent(listing.monthlyRent)}
                      </div>

                      <p className="text-xs text-slate-700 font-medium font-body line-clamp-2 mt-2 leading-relaxed">
                        {listing.description}
                      </p>
                    </div>

                    {/* Specs Row: "3 Beds · 3 Baths · 10 Marla" (apartments show floor: "2 Beds · 2 Baths · 5th Floor") */}
                    <div className="py-3 border-y border-slate-100 text-xs text-slate-700 font-body flex items-center justify-between font-medium">
                      <span className="flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5 text-slate-400" /> {listing.beds} Beds
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Bath className="w-3.5 h-3.5 text-slate-400" /> {listing.baths} Baths
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-[#1B2A44] font-semibold">
                        <Maximize2 className="w-3.5 h-3.5 text-[#2F4B73]" /> {listing.sizeOrFloor}
                      </span>
                    </div>

                    {/* Clickable link to /rent/:id */}
                    <div className="w-full py-3 px-5 rounded-full bg-slate-100 group-hover:bg-[#1B2A44] text-[#1B2A44] group-hover:text-white font-display text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-between">
                      <span>View Rental Dossier</span>
                      <span className="w-6 h-6 rounded-full bg-white text-[#1B2A44] flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-md space-y-3">
            <Building className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-display font-bold text-lg text-[#1B2A44] uppercase">
              No Homes Match Your Filters
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto font-body">
              Try adjusting your city, property type, rent bracket, or furnishing parameters.
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
