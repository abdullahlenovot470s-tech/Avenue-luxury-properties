import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  KeyRound,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SafeImage } from '../components/common/SafeImage';
import { HERO_ASSETS } from '../data/realEstateData';
import { GoogleSignInButton } from '../components/common/GoogleSignInButton';
import {
  DemoGoogleAccountModal,
  DemoPakistaniAccount,
} from '../components/modals/DemoGoogleAccountModal';

// Mask email e.g. "ahmed.raza@gmail.com" -> "ahm***@gmail.com"
function maskEmail(emailStr: string): string {
  if (!emailStr || !emailStr.includes('@')) return emailStr;
  const [local, domain] = emailStr.split('@');
  if (local.length <= 3) {
    return `${local[0]}***@${domain}`;
  }
  return `${local.slice(0, 3)}***@${domain}`;
}

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  // Unverified state handling
  const [isUnverified, setIsUnverified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [checkingVerification, setCheckingVerification] = useState(false);

  // Forgot password modal
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  // Demo fallback modal
  const [showDemoModal, setShowDemoModal] = useState(false);

  const {
    loginWithEmail,
    loginWithGoogle,
    checkEmailVerified,
    resendVerificationEmail,
    sendPasswordReset,
    loginWithDemoAccount,
  } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/profile';

  React.useEffect(() => {
    document.title = 'Client Login | Avenue Luxury Properties';
  }, []);

  // Cooldown timer
  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Google Sign In
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    const result = await loginWithGoogle();
    setGoogleLoading(false);

    if (result.success) {
      showToast('Assalam o Alaikum! Welcome back to Avenue.', 'success');
      navigate(from, { replace: true });
    } else {
      if (result.error?.includes('Unauthorized domain')) {
        showToast(result.error, 'error');
        setShowDemoModal(true);
      } else {
        setError(result.error || 'Google sign-in could not be completed.');
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
    navigate(from, { replace: true });
  };

  // Email/Password submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both your email and password.');
      return;
    }

    setLoading(true);
    const result = await loginWithEmail(email, password);
    setLoading(false);

    if (result.success) {
      showToast('Assalam o Alaikum! Welcome back to Avenue.', 'success');
      navigate(from, { replace: true });
    } else if (result.unverified) {
      setIsUnverified(true);
      setResendCooldown(60);
      showToast('Please verify your email before signing in.', 'info');
    } else {
      setError(result.error || 'Login failed. Please check your credentials.');
    }
  };

  // Re-check verification
  const handleVerifyCheck = async () => {
    setCheckingVerification(true);
    const verified = await checkEmailVerified();
    setCheckingVerification(false);

    if (verified) {
      showToast('Email verified successfully! Welcome to Avenue.', 'success');
      setIsUnverified(false);
      navigate(from, { replace: true });
    } else {
      showToast('Email not yet verified. Please click the link sent to your inbox.', 'info');
    }
  };

  // Resend verification
  const handleResendVerification = async () => {
    if (resendCooldown > 0) return;
    const res = await resendVerificationEmail();
    if (res.success) {
      setResendCooldown(60);
      showToast('A new verification email has been sent.', 'success');
    } else {
      showToast(res.error || 'Could not resend verification email.', 'error');
    }
  };

  // Send Password Reset
  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    setForgotLoading(true);
    const result = await sendPasswordReset(forgotEmail);
    setForgotLoading(false);

    if (result.success) {
      setForgotSent(true);
      showToast(`Password reset link sent to ${forgotEmail}.`, 'success');
    } else {
      showToast(result.error || 'Could not send password reset email.', 'error');
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl bg-white rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-2xl border border-slate-100 grid grid-cols-1 lg:grid-cols-12 min-h-[640px]"
      >
        {/* Left Half: Villa Visual with Glass Quote Card */}
        <div className="lg:col-span-6 relative hidden lg:block overflow-hidden p-8 sm:p-10 flex flex-col justify-between">
          <div className="absolute inset-0 z-0">
            <SafeImage
              src={HERO_ASSETS.authVilla}
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
              Private Portal
            </span>
          </div>

          <div className="relative z-10 glass-panel rounded-3xl p-6 text-white border border-white/20 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-1.5 text-amber-300 text-xs mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-display uppercase tracking-widest text-[10px] text-white/80">
                Verified Client Privacy
              </span>
            </div>
            <p className="font-display font-bold text-xl sm:text-2xl tracking-tight text-white leading-snug">
              "Your next address is waiting."
            </p>
            <p className="font-body text-xs text-white/70 mt-2">
              Access off-market residences, verified registry records, and private listings.
            </p>
          </div>
        </div>

        {/* Right Half: Form or Unverified State Card */}
        <div className="lg:col-span-6 p-8 sm:p-12 md:p-14 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {isUnverified ? (
              /* Unverified Email Screen */
              <div className="space-y-6 py-4 animate-in fade-in duration-300">
                <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
                  <Mail className="w-7 h-7" />
                </div>

                <div className="text-center space-y-2">
                  <span className="text-[10px] font-display uppercase tracking-widest text-amber-700 font-bold block">
                    Verification Required
                  </span>
                  <h3 className="font-display font-extrabold text-2xl uppercase tracking-tight text-[#1B2A44]">
                    Verify Your Email
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-body leading-relaxed max-w-sm mx-auto">
                    We sent a verification link to{' '}
                    <span className="font-bold text-[#1B2A44]">{maskEmail(email)}</span>.
                    Open it, then come back and tap the button below to sign in.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
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

                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resendCooldown > 0}
                    className="w-full py-3 px-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-display font-semibold text-xs uppercase tracking-wider transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {resendCooldown > 0
                      ? `Resend email in ${resendCooldown}s`
                      : 'Resend verification email'}
                  </button>
                </div>

                <div className="pt-2 text-center space-y-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsUnverified(false)}
                    className="text-xs font-display uppercase tracking-wider text-[#2F4B73] hover:underline cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 font-body">
                    <span className="font-semibold text-slate-700">Tip:</span> Check your spam or junk folder if the link does not arrive within a minute.
                  </div>
                </div>
              </div>
            ) : (
              /* Regular Sign In Screen */
              <>
                <div className="mb-6">
                  <span className="text-[10px] font-display uppercase tracking-widest text-[#2F4B73] font-bold block mb-1">
                    Client Access
                  </span>
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1B2A44] uppercase tracking-tight">
                    SIGN IN TO AVENUE
                  </h2>
                  <p className="font-body text-xs sm:text-sm text-slate-500 mt-1">
                    Enter your credentials to access your shortlisted properties.
                  </p>
                </div>

                {error && (
                  <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
                    {error}
                  </div>
                )}

                {/* 1. Continue with Google Button */}
                <div className="space-y-4">
                  <GoogleSignInButton
                    onClick={handleGoogleLogin}
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

                {/* 2. Email / Password Form */}
                <form onSubmit={handleSubmit} className="space-y-4 mt-5">
                  <div>
                    <label className="block text-[11px] font-display uppercase tracking-wider text-slate-700 font-semibold mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="e.g. ahmed.raza@avenue.pk"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-[#2F4B73] focus:bg-white transition-all"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] font-display uppercase tracking-wider text-slate-700 font-semibold">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotEmail(email);
                          setShowForgotPassword(true);
                          setForgotSent(false);
                        }}
                        className="text-[11px] font-body text-[#2F4B73] hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-[#2F4B73] focus:bg-white transition-all"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded text-[#1B2A44] border-slate-300 focus:ring-0 cursor-pointer"
                      />
                      <span className="text-xs text-slate-600 font-body">Remember this workstation</span>
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-6 rounded-full bg-[#1B2A44] hover:bg-[#2F4B73] text-white font-display font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-between group cursor-pointer disabled:opacity-60 active:scale-[0.99]"
                    >
                      <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                      <span className="w-6 h-6 rounded-full bg-white text-[#1B2A44] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </button>
                  </div>

                  {/* Fallback Demo chooser prompt */}
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => setShowDemoModal(true)}
                      className="text-[11px] text-[#2F4B73] hover:underline font-body cursor-pointer"
                    >
                      Want to test with a Pakistani demo account? Click here
                    </button>
                  </div>

                  <div className="pt-4 text-center">
                    <span className="text-xs text-slate-500 font-body">
                      Don't have an account?{' '}
                      <Link
                        to="/signup"
                        className="font-display uppercase tracking-wider text-xs font-bold text-[#1B2A44] hover:text-[#2F4B73]"
                      >
                        Sign Up
                      </Link>
                    </span>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setShowForgotPassword(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-700 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2F4B73] flex items-center justify-center mb-4">
              <KeyRound className="w-6 h-6" />
            </div>

            <h3 className="font-display font-extrabold text-xl text-[#1B2A44] uppercase tracking-tight">
              Reset Password
            </h3>
            <p className="text-xs text-slate-500 font-body mt-1">
              Enter your registered email address to receive a secure password reset link.
            </p>

            {forgotSent ? (
              <div className="mt-5 space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                  A reset link has been dispatched to <strong>{forgotEmail}</strong>. Please check your inbox and spam folder.
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="w-full py-3 rounded-full bg-[#1B2A44] text-white font-display text-xs uppercase tracking-wider font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendReset} className="mt-5 space-y-4">
                <div>
                  <label className="block text-[11px] font-display uppercase tracking-wider text-slate-700 font-semibold mb-1">
                    Registered Email
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="e.g. client@avenue.pk"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:border-[#2F4B73] focus:outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="flex-1 py-3 rounded-full border border-slate-200 text-slate-600 text-xs font-display uppercase tracking-wider font-semibold hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 py-3 rounded-full bg-[#1B2A44] text-white text-xs font-display uppercase tracking-wider font-semibold hover:bg-[#2F4B73] cursor-pointer disabled:opacity-60"
                  >
                    {forgotLoading ? 'Sending...' : 'Send Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Demo Account Modal Fallback */}
      <DemoGoogleAccountModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        onSelectAccount={handleDemoAccountSelect}
      />
    </div>
  );
};
