import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Eye, EyeOff, Lock, Mail, User, CheckCircle2, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SafeImage } from '../components/common/SafeImage';
import { HERO_ASSETS } from '../data/realEstateData';
import { GoogleSignInButton } from '../components/common/GoogleSignInButton';
import { DemoGoogleAccountModal, DemoPakistaniAccount } from '../components/modals/DemoGoogleAccountModal';

// Mask email e.g. "ahmed.raza@gmail.com" -> "ahm***@gmail.com"
function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;
  const [local, domain] = email.split('@');
  if (local.length <= 3) {
    return `${local[0]}***@${domain}`;
  }
  return `${local.slice(0, 3)}***@${domain}`;
}

export const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Email verification step states
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [checkingVerification, setCheckingVerification] = useState(false);

  // Demo account modal fallback
  const [showDemoModal, setShowDemoModal] = useState(false);

  const { signupWithEmail, loginWithGoogle, checkEmailVerified, resendVerificationEmail, loginWithDemoAccount } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Create Account | Avenue Luxury Properties';
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must acknowledge the terms and privacy covenants.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Google sign in handler
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const result = await loginWithGoogle();
    setGoogleLoading(false);

    if (result.success) {
      showToast('Welcome to Avenue!', 'success');
      navigate('/profile', { replace: true });
    } else {
      if (result.error?.includes('Unauthorized domain')) {
        showToast(result.error, 'error');
        setShowDemoModal(true);
      } else {
        showToast(result.error || 'Google sign-in could not be completed.', 'error');
      }
    }
  };

  const handleDemoAccountSelect = (account: DemoPakistaniAccount) => {
    setShowDemoModal(false);
    loginWithDemoAccount({
      name: account.name,
      email: account.email,
    });
    const firstName = account.name.split(' ')[0];
    showToast(`Welcome, ${firstName}! (Demo mode)`, 'success');
    navigate('/profile', { replace: true });
  };

  // Email form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = await signupWithEmail({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
    setLoading(false);

    if (result.success) {
      setStep('verify');
      setResendCooldown(60);
      showToast('Account registered. Please verify your email to activate.', 'info');
    } else {
      setErrors((prev) => ({
        ...prev,
        email: result.error || 'Failed to create account.',
      }));
      showToast(result.error || 'Failed to create account.', 'error');
    }
  };

  // Check if verified
  const handleVerifyCheck = async () => {
    setCheckingVerification(true);
    const isVerified = await checkEmailVerified();
    setCheckingVerification(false);

    if (isVerified) {
      showToast('Email verified. Welcome to Avenue!', 'success');
      navigate('/profile', { replace: true });
    } else {
      showToast('Email not yet verified. Please tap the verification link in your inbox.', 'info');
    }
  };

  // Resend email
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    const res = await resendVerificationEmail();
    if (res.success) {
      setResendCooldown(60);
      showToast('A new verification email has been dispatched.', 'success');
    } else {
      showToast(res.error || 'Could not resend email. Try again shortly.', 'error');
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl bg-white rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-2xl border border-slate-100 grid grid-cols-1 lg:grid-cols-12 min-h-[680px]"
      >
        {/* Left Half: Clean White Form / Verification Card */}
        <div className="lg:col-span-6 p-8 sm:p-12 md:p-14 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {step === 'form' ? (
              <>
                <div className="mb-6">
                  <span className="text-[10px] font-display uppercase tracking-widest text-[#2F4B73] font-bold block mb-1">
                    Client Registration
                  </span>
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1B2A44] uppercase tracking-tight">
                    JOIN AVENUE
                  </h2>
                  <p className="font-body text-xs sm:text-sm text-slate-500 mt-1">
                    Register for confidential access to architectural residences in Pakistan.
                  </p>
                </div>

                {/* 1. Google Button as First Option */}
                <div className="space-y-4">
                  <GoogleSignInButton
                    onClick={handleGoogleSignIn}
                    loading={googleLoading}
                    text="Continue with Google"
                  />

                  {/* Divider */}
                  <div className="relative flex items-center justify-center">
                    <div className="w-full border-t border-slate-200" />
                    <span className="absolute bg-white px-3 text-[11px] font-display uppercase tracking-wider text-slate-400">
                      or continue with email
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5 mt-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[11px] font-display uppercase tracking-wider text-slate-700 font-semibold mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. Fatima Noor"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm bg-slate-50 focus:bg-white focus:outline-none transition-all ${
                          errors.name
                            ? 'border-rose-400 focus:border-rose-500'
                            : 'border-slate-200 focus:border-[#2F4B73]'
                        }`}
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                    {errors.name && (
                      <p className="text-[11px] text-rose-500 font-body mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[11px] font-display uppercase tracking-wider text-slate-700 font-semibold mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="e.g. fatima.noor@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm bg-slate-50 focus:bg-white focus:outline-none transition-all ${
                          errors.email
                            ? 'border-rose-400 focus:border-rose-500'
                            : 'border-slate-200 focus:border-[#2F4B73]'
                        }`}
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                    {errors.email && (
                      <p className="text-[11px] text-rose-500 font-body mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-[11px] font-display uppercase tracking-wider text-slate-700 font-semibold mb-1">
                      Password (min. 8 characters)
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a secure password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-xs sm:text-sm bg-slate-50 focus:bg-white focus:outline-none transition-all ${
                          errors.password
                            ? 'border-rose-400 focus:border-rose-500'
                            : 'border-slate-200 focus:border-[#2F4B73]'
                        }`}
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-[11px] text-rose-500 font-body mt-1">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-[11px] font-display uppercase tracking-wider text-slate-700 font-semibold mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Re-enter password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({ ...formData, confirmPassword: e.target.value })
                        }
                        className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-xs sm:text-sm bg-slate-50 focus:bg-white focus:outline-none transition-all ${
                          errors.confirmPassword
                            ? 'border-rose-400 focus:border-rose-500'
                            : 'border-slate-200 focus:border-[#2F4B73]'
                        }`}
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-[11px] text-rose-500 font-body mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Terms Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.agreeTerms}
                        onChange={(e) =>
                          setFormData({ ...formData, agreeTerms: e.target.checked })
                        }
                        className="mt-0.5 rounded border-slate-300 text-[#1B2A44] focus:ring-[#2F4B73] cursor-pointer"
                      />
                      <span>
                        I acknowledge Avenue's client representation terms, non-disclosure protocols, and verified legal representation standards.
                      </span>
                    </label>
                    {errors.agreeTerms && (
                      <p className="text-[11px] text-rose-500 font-body mt-1">
                        {errors.agreeTerms}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-6 rounded-full bg-[#1B2A44] hover:bg-[#2F4B73] text-white font-display font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 active:scale-[0.99]"
                    >
                      {loading ? (
                        <span>Registering Client Account...</span>
                      ) : (
                        <>
                          <span>Create Avenue Account</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Footer link to Login */}
                <div className="mt-6 text-center text-xs text-slate-500 font-body">
                  <span>Already an Avenue client? </span>
                  <Link
                    to="/login"
                    className="font-display uppercase tracking-wider font-bold text-[#1B2A44] hover:text-[#2F4B73] underline underline-offset-4"
                  >
                    Login here
                  </Link>
                </div>
              </>
            ) : (
              /* Step 2: Email Verification Card */
              <div className="space-y-6 py-4 animate-in fade-in duration-300">
                <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                  <Mail className="w-7 h-7" />
                </div>

                <div className="text-center space-y-2">
                  <span className="text-[10px] font-display uppercase tracking-widest text-emerald-700 font-bold block">
                    Verification Link Dispatched
                  </span>
                  <h3 className="font-display font-extrabold text-2xl uppercase tracking-tight text-[#1B2A44]">
                    Verify Your Email
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-body leading-relaxed max-w-sm mx-auto">
                    We sent a verification link to{' '}
                    <span className="font-bold text-[#1B2A44]">{maskEmail(formData.email)}</span>.
                    Open it, then come back and tap the button below.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {/* Button 1: I've verified my email */}
                  <button
                    type="button"
                    onClick={handleVerifyCheck}
                    disabled={checkingVerification}
                    className="w-full py-3.5 px-6 rounded-full bg-[#1B2A44] hover:bg-[#2F4B73] text-white font-display font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    {checkingVerification ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                    <span>I've verified my email</span>
                  </button>

                  {/* Button 2: Resend email with 60-second countdown */}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0}
                    className="w-full py-3 px-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-display font-semibold text-xs uppercase tracking-wider transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {resendCooldown > 0
                      ? `Resend email in ${resendCooldown}s`
                      : 'Resend email'}
                  </button>
                </div>

                <div className="pt-2 text-center space-y-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="text-xs font-display uppercase tracking-wider text-[#2F4B73] hover:underline cursor-pointer"
                  >
                    Change email
                  </button>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 font-body">
                    <span className="font-semibold text-slate-700">Tip:</span> Check your spam or junk folder if the link does not arrive within a minute.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Half: Villa Showcase with Quote Card */}
        <div className="lg:col-span-6 relative hidden lg:block overflow-hidden p-8 sm:p-10 flex flex-col justify-between">
          <div className="absolute inset-0 z-0">
            <SafeImage
              src={HERO_ASSETS.approachWalkway}
              alt="Avenue Luxury Villa Architecture"
              className="w-full h-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1726]/90 via-[#1B2A44]/30 to-transparent" />
          </div>

          <div className="relative z-10 flex items-center justify-between text-white">
            <Link to="/" className="font-display font-bold text-2xl tracking-tighter text-white">
              Avenue
            </Link>
            <span className="text-[10px] font-display uppercase tracking-widest text-white/70 glass-card-subtle px-3 py-1 rounded-full">
              Verified Ownership
            </span>
          </div>

          <div className="relative z-10 glass-panel rounded-3xl p-6 text-white border border-white/20 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-1.5 text-amber-300 text-xs mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-display uppercase tracking-widest text-[10px] text-white/80">
                Direct Principal Security
              </span>
            </div>
            <p className="font-display font-bold text-xl sm:text-2xl tracking-tight text-white leading-snug">
              "Building architectural legacies with legal certainty."
            </p>
            <p className="font-body text-xs text-white/70 mt-2">
              Join Pakistan's premier registry of modern estates, verified fards, and vetted luxury acquisitions.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Demo Account Modal Fallback */}
      <DemoGoogleAccountModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        onSelectAccount={handleDemoAccountSelect}
      />
    </div>
  );
};
