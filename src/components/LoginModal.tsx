import React, { useState, useEffect, useRef } from 'react';
import { 
  LogIn, 
  AlertCircle, 
  X, 
  Eye, 
  EyeOff, 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  HelpCircle,
  Phone,
  Mail,
  KeyRound,
  RotateCw,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { AuthUser, UserRole } from '../types';
import { dataStore } from '../services/storage';
import { useAppContent } from '../context/ContentContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  initialRole?: UserRole;
  isAdminOnly?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialRole = 'student',
  isAdminOnly = false
}) => {
  const { content } = useAppContent();
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    isAdminOnly ? 'admin' : (initialRole === 'admin' ? 'student' : initialRole)
  );

  // Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  // OTP Verification State for Admin
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [otpCode, setOtpCode] = useState('');
  const [dispatchedOtp, setDispatchedOtp] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [otpExpirySeconds, setOtpExpirySeconds] = useState(300); // 5 minutes
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cooldownTimerRef = useRef<any>(null);
  const expiryTimerRef = useRef<any>(null);

  useEffect(() => {
    if (isAdminOnly) {
      setSelectedRole('admin');
    } else {
      setSelectedRole(initialRole === 'admin' ? 'student' : initialRole);
    }
    setIdentifier('');
    setPassword('');
    setError(null);
    setSuccessMessage(null);
    setShowHelp(false);
    setStep('credentials');
    setOtpCode('');
    setDispatchedOtp(null);
  }, [initialRole, isAdminOnly, isOpen]);

  // Timers for OTP cooldown and expiry
  useEffect(() => {
    if (step === 'otp') {
      // Cooldown 60s
      setResendCooldown(60);
      cooldownTimerRef.current = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(cooldownTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Expiry 5 mins (300s)
      setOtpExpirySeconds(300);
      expiryTimerRef.current = setInterval(() => {
        setOtpExpirySeconds(prev => {
          if (prev <= 1) {
            clearInterval(expiryTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
      if (expiryTimerRef.current) clearInterval(expiryTimerRef.current);
    };
  }, [step]);

  if (!isOpen) return null;

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setIdentifier('');
    setPassword('');
    setError(null);
    setSuccessMessage(null);
    setStep('credentials');
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const idInput = identifier.trim();
    const passInput = password.trim();

    if (!idInput) {
      if (selectedRole === 'student') setError('Please enter your student Roll Number.');
      else if (selectedRole === 'teacher') setError('Please enter your Teacher ID.');
      else setError('Please enter your administrator Email ID.');
      return;
    }

    if (!passInput) {
      setError('Please enter your account password.');
      return;
    }

    if (selectedRole === 'student') {
      const res = dataStore.authenticateStudent(idInput, passInput);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Invalid credentials. Please check your Roll Number and password.');
      }
    } else if (selectedRole === 'teacher') {
      const res = dataStore.authenticateTeacher(idInput, passInput);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Invalid credentials. Please check your Teacher ID and password.');
      }
    } else {
      // Admin Login -> Direct authentication without OTP
      const res = dataStore.authenticateAdmin(idInput, passInput);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Invalid credentials. Please verify your administrator email and password.');
      }
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setError('Please enter the full 6-digit OTP sent to your administrator email.');
      return;
    }

    setIsSubmitting(true);
    const targetEmail = identifier.trim().includes('@') ? identifier.trim() : 'admin.phimatics@gmail.com';
    const res = dataStore.verifyAdminOtp(targetEmail, otpCode.trim());
    setIsSubmitting(false);

    if (res.success && res.user) {
      onLoginSuccess(res.user);
      onClose();
    } else {
      setError(res.error || 'OTP verification failed. Please check the code and try again.');
    }
  };

  const handleResendOtp = () => {
    if (resendCooldown > 0) return;
    setError(null);
    setSuccessMessage(null);

    const targetEmail = identifier.trim().includes('@') ? identifier.trim() : 'admin.phimatics@gmail.com';
    const otpRes = dataStore.sendAdminOtp(targetEmail);

    if (otpRes.success) {
      setResendCooldown(60);
      setOtpExpirySeconds(300);
      setOtpCode('');
      if (otpRes.code) setDispatchedOtp(otpRes.code);
      setSuccessMessage(`A new 6-digit OTP has been sent to ${targetEmail}.`);
    } else {
      setError(otpRes.error || 'Failed to resend OTP.');
    }
  };

  const getIdentifierLabel = () => {
    switch (selectedRole) {
      case 'student':
        return 'Roll Number';
      case 'teacher':
        return 'Teacher ID';
      case 'admin':
        return 'Email ID';
    }
  };

  const getIdentifierPlaceholder = () => {
    switch (selectedRole) {
      case 'student':
        return 'Enter Roll Number';
      case 'teacher':
        return 'Enter Teacher ID';
      case 'admin':
        return 'Enter Email ID';
    }
  };

  const formatSeconds = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={content.general?.logoUrl || "/phimatics-logo.svg"} 
              alt={content.general?.appName || "PhiMatiCs Classes"} 
              className="w-10 h-10 rounded-xl object-contain border border-slate-700 shadow-xs bg-slate-950 p-0.5 shrink-0" 
            />
            <div>
              <h2 className="text-base font-extrabold tracking-tight">{content.general?.appName || "PhiMatiCs Classes"}</h2>
              <p className="text-xs text-sky-400 font-semibold">
                {isAdminOnly ? "Administrator Login" : (content.general?.tagline || "The Learning App")}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Tabs or Admin Portal Header */}
        {isAdminOnly ? (
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 border border-indigo-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Administrator Portal
                </h3>
                <p className="text-[11px] text-slate-500">
                  Secure administrator credentials & OTP required
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Role Tabs: Exactly 2 options (Student and Teacher) */
          <div className="p-4 pt-5 pb-2 bg-slate-50 border-b border-slate-200">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-1">
              Select Login Option
            </div>
            <div className="grid grid-cols-2 gap-2 bg-slate-200/80 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => handleRoleChange('student')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  selectedRole === 'student'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className={`w-4 h-4 ${selectedRole === 'student' ? 'text-sky-600' : 'text-slate-400'}`} />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('teacher')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  selectedRole === 'teacher'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className={`w-4 h-4 ${selectedRole === 'teacher' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>Teacher</span>
              </button>
            </div>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 pt-5">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* STEP 1: CREDENTIALS INPUT */}
          {step === 'credentials' && (
            <>
              <div className="mb-4">
                <h3 className="text-base font-bold text-slate-900">
                  {selectedRole === 'student' && 'Student Account Login'}
                  {selectedRole === 'teacher' && 'Teacher Portal Login'}
                  {selectedRole === 'admin' && 'Administrator Login'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedRole === 'student' && 'Enter your registered Roll Number and password to access your dashboard.'}
                  {selectedRole === 'teacher' && 'Enter your registered Teacher ID and password to access assigned classes.'}
                  {selectedRole === 'admin' && 'Enter your administrator email and password to receive an email OTP.'}
                </p>
              </div>

              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    {getIdentifierLabel()}
                  </label>
                  <input
                    type={selectedRole === 'admin' ? 'email' : 'text'}
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder={getIdentifierPlaceholder()}
                    required
                    autoFocus
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter Password"
                      required
                      className="w-full pl-3.5 pr-11 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg transition cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 text-white font-bold rounded-xl transition shadow-md text-sm flex items-center justify-center gap-2 cursor-pointer mt-2 ${
                    selectedRole === 'student' 
                      ? 'bg-sky-600 hover:bg-sky-500 shadow-sky-600/20' 
                      : selectedRole === 'teacher'
                      ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                      : 'bg-indigo-700 hover:bg-indigo-600 shadow-indigo-700/20'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>
                    {selectedRole === 'admin' ? 'Sign In as Administrator' : 'Sign In'}
                  </span>
                </button>
              </form>
            </>
          )}

          {/* STEP 2: ADMIN OTP VERIFICATION SCREEN */}
          {step === 'otp' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-indigo-950">
                    <KeyRound className="w-4 h-4 text-indigo-600" />
                    <span>Verification Required</span>
                  </div>
                  {dispatchedOtp && (
                    <button
                      type="button"
                      onClick={() => setOtpCode(dispatchedOtp)}
                      className="text-[11px] font-extrabold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 border border-indigo-300 px-2.5 py-1 rounded-lg transition cursor-pointer"
                    >
                      Auto-fill: {dispatchedOtp}
                    </button>
                  )}
                </div>
                <p className="leading-relaxed">
                  A 6-digit OTP code has been dispatched to <strong>{identifier.trim() || 'admin.phimatics@gmail.com'}</strong>.
                </p>
                {dispatchedOtp && (
                  <p className="text-[11px] font-semibold text-indigo-800 pt-0.5">
                    [Dispatched Code for Testing]: <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-indigo-200 text-indigo-950 font-bold">{dispatchedOtp}</span>
                  </p>
                )}
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                      6-Digit OTP Code
                    </label>
                    <span className="text-[11px] font-semibold text-amber-700">
                      Expires in: {formatSeconds(otpExpirySeconds)}
                    </span>
                  </div>

                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit OTP"
                    required
                    autoFocus
                    className="w-full px-4 py-3 text-center text-xl font-mono tracking-widest rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || otpExpirySeconds <= 0}
                  className="w-full py-3 px-4 bg-indigo-700 hover:bg-indigo-600 text-white font-bold rounded-xl transition shadow-md shadow-indigo-700/20 text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify OTP & Open Dashboard</span>
                </button>
              </form>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0}
                  className="text-indigo-600 font-bold hover:underline disabled:text-slate-400 disabled:no-underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${resendCooldown > 0 ? '' : 'animate-spin-once'}`} />
                  <span>
                    {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP Code'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep('credentials');
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                >
                  Change Email / Password
                </button>
              </div>
            </div>
          )}

          {/* Help & Support note (only for students & teachers) */}
          {!isAdminOnly && step === 'credentials' && (
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Forgot password or credentials?</span>
              <button
                type="button"
                onClick={() => setShowHelp(prev => !prev)}
                className="text-sky-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Help Desk</span>
              </button>
            </div>
          )}

          {showHelp && !isAdminOnly && step === 'credentials' && (
            <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2 animate-in fade-in duration-100">
              <p className="font-semibold text-slate-800">
                Institutional Credential Assistance
              </p>
              <p className="text-[11px] leading-relaxed">
                Roll Numbers and Teacher IDs are issued by the academic office. If you misplaced your credentials or need a password reset, reach out to the admin desk:
              </p>
              <div className="flex flex-col gap-1.5 text-[11px] font-medium text-slate-700 pt-1 border-t border-slate-200/60">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    Academic Helpline:{' '}
                    <a href="tel:+916361069450" className="text-emerald-700 font-bold hover:underline">
                      +91 6361069450
                    </a>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>
                    Desk Email:{' '}
                    <a href="mailto:phimatics2023@gmail.com" className="text-sky-700 font-bold hover:underline">
                      phimatics2023@gmail.com
                    </a>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
