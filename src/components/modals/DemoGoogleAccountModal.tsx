import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle } from 'lucide-react';
import { GoogleGLogo } from '../common/GoogleSignInButton';

export interface DemoPakistaniAccount {
  name: string;
  email: string;
  role: string;
  initials: string;
}

export const DEMO_PAKISTANI_ACCOUNTS: DemoPakistaniAccount[] = [
  {
    name: 'Zainab Malik',
    email: 'zainab.malik@gmail.com',
    role: 'Verified Resident (DHA Phase 5 Lahore)',
    initials: 'ZM',
  },
  {
    name: 'Hamza Chaudhry',
    email: 'hamza.chaudhry@gmail.com',
    role: 'Overseas Investor (Manchester / Islamabad F-7)',
    initials: 'HC',
  },
  {
    name: 'Tariq Aziz',
    email: 'tariq.aziz@gmail.com',
    role: 'Sanctuary Portfolio Owner (Clifton Karachi)',
    initials: 'TA',
  },
];

interface DemoGoogleAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (account: DemoPakistaniAccount) => void;
}

export const DemoGoogleAccountModal: React.FC<DemoGoogleAccountModalProps> = ({
  isOpen,
  onClose,
  onSelectAccount,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-100 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <GoogleGLogo className="w-5 h-5" />
              <h3 className="font-display font-extrabold text-sm uppercase tracking-wider text-[#1B2A44]">
                Choose an account
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Explicit Disclosure Badge */}
          <div className="my-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5 text-xs font-body">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold font-display uppercase tracking-wider text-[11px] block">
                Demo Sign-in Mode
              </span>
              <span>Connect Firebase to enable real Google login. Select a demo account below to test:</span>
            </div>
          </div>

          {/* Account List */}
          <div className="space-y-2.5">
            {DEMO_PAKISTANI_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                onClick={() => onSelectAccount(acc)}
                className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-[#1B2A44] hover:bg-slate-50 transition-all flex items-center gap-3.5 text-left cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-[#1B2A44] text-white flex items-center justify-center font-display font-bold text-xs tracking-wider shadow-sm group-hover:scale-105 transition-transform">
                  {acc.initials}
                </div>
                <div className="truncate flex-1">
                  <div className="font-display font-bold text-xs text-[#1B2A44] truncate">
                    {acc.name}
                  </div>
                  <div className="text-[11px] text-slate-500 font-body truncate">{acc.email}</div>
                  <div className="text-[10px] text-[#2F4B73] font-medium">{acc.role}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="pt-4 text-center">
            <button
              onClick={onClose}
              className="text-xs font-display uppercase tracking-wider text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
