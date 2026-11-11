import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HERO_ASSETS } from '../data/realEstateData';
import { SafeImage } from './common/SafeImage';
import { CheckCircle2, Send, PhoneCall } from 'lucide-react';

export const ContactCta: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Please provide a contact phone number.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <section
      id="contact"
      className="relative w-full py-6 sm:py-10 px-3 sm:px-6 md:px-8 max-w-[1440px] mx-auto"
    >
      {/* Rounded Image Card Container with Dark Mood Overlay */}
      <div className="relative w-full min-h-[28rem] sm:min-h-[32rem] rounded-[24px] sm:rounded-[32px] overflow-hidden p-6 sm:p-10 md:p-12 text-white shadow-2xl flex flex-col justify-center">
        {/* Architectural Image Background */}
        <div className="absolute inset-0 z-0">
          <SafeImage
            src={HERO_ASSETS.ctaBackground}
            fallbackSrc={HERO_ASSETS.heroImage}
            alt="Luxury mountain residence at dusk"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-[#0e1726]/85 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1624]/95 via-[#1B2A44]/70 to-[#0d1624]/85" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Glassmorphism Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 w-full max-w-lg"
          >
            <div className="glass-panel rounded-3xl p-6 sm:p-8 md:p-10 text-white shadow-2xl border border-white/20">
              <span className="text-[10px] font-display uppercase tracking-widest text-white/70 block mb-1">
                Direct Principal Access
              </span>
              <h3 className="font-display font-extrabold text-xl sm:text-2xl uppercase tracking-tight text-white mb-6">
                GOT A QUESTION?
              </h3>

              {submitted ? (
                <div className="py-8 text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-400 rounded-full flex items-center justify-center mx-auto text-emerald-300">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-display font-bold text-lg text-white uppercase">
                    Inquiry Received
                  </h4>
                  <p className="text-xs text-white/80 leading-relaxed font-body">
                    Assalam o Alaikum, <span className="font-semibold text-white">{formData.name}</span>. An Avenue managing partner will contact you directly within 2 business hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', phone: '' });
                    }}
                    className="text-xs font-display uppercase tracking-wider text-white/80 hover:text-white underline underline-offset-4 pt-2 cursor-pointer"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="text-xs text-rose-300 bg-rose-500/20 border border-rose-400/30 px-3 py-2 rounded-xl">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-display uppercase tracking-wider text-white/80 mb-1.5">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Usman Tariq"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-display uppercase tracking-wider text-white/80 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. usman.tariq@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-display uppercase tracking-wider text-white/80 mb-1.5">
                      Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 0300 1234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-6 rounded-full bg-white text-[#1B2A44] font-display font-bold text-xs uppercase tracking-widest hover:bg-[#E6ECF5] transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 active:scale-98"
                    >
                      {loading ? (
                        <span>Connecting...</span>
                      ) : (
                        <>
                          <span>Submit Inquiry</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>

          {/* Right Column: Giant "LET'S TALK" Headline */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 flex flex-col justify-center items-start lg:items-end text-left lg:text-right"
          >
            <span className="text-xs sm:text-sm font-display uppercase tracking-widest text-white/60 mb-2">
              Confidential Consultation
            </span>

            <h2
              className="font-display font-black leading-[0.92] tracking-tighter text-white uppercase select-none"
              style={{ fontSize: 'clamp(3.5rem, 6.5vw, 6.5rem)' }}
            >
              LET'S
              <br />
              TALK
            </h2>

            <p className="mt-6 font-body text-xs sm:text-sm text-white/70 max-w-md leading-relaxed">
              Whether acquiring a verified architectural home or discussing property investments in DHA, CDA sectors, or Bahria Town, our senior advisory team is at your disposal across Pakistan.
            </p>

            <div className="mt-6 flex items-center gap-3 glass-card-subtle px-4 py-2.5 rounded-full text-xs text-white/90">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>Direct Advisory: +92 51 265 4100</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
