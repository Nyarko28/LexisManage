import React, { useState } from 'react';
import { 
  Scale, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  Sparkles,
  ChevronLeft,
  Mail,
  Key,
  User as UserIcon,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { db, doc, getDoc } from '../firebase';
import { Invite } from '../types';
import { useEffect } from 'react';

interface LoginPageProps {
  onBack: () => void;
  inviteId?: string | null;
}

type AuthMode = 'login' | 'signup' | 'google';

export const LoginPage = ({ onBack, inviteId }: LoginPageProps) => {
  const { login, emailLogin, emailSignup } = useAuth();
  const [mode, setMode] = useState<AuthMode>(inviteId ? 'signup' : 'google');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invite, setInvite] = useState<Invite | null>(null);
  const [inviteLoading, setInviteLoading] = useState(!!inviteId);

  useEffect(() => {
    if (inviteId) {
      const fetchInvite = async () => {
        try {
          const inviteRef = doc(db, 'invites', inviteId);
          const inviteSnap = await getDoc(inviteRef);
          if (inviteSnap.exists() && inviteSnap.data().status === 'pending') {
            const data = { ...inviteSnap.data(), id: inviteSnap.id } as Invite;
            setInvite(data);
            setEmail(data.email);
            setMode('signup');
          } else {
            setError('This invitation link is invalid, expired, or has already been used.');
          }
        } catch (err) {
          setError('Failed to verify invitation. Please try again later.');
        } finally {
          setInviteLoading(false);
        }
      };
      fetchInvite();
    }
  }, [inviteId]);

  const handleGoogleLogin = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await login(inviteId || undefined);
    } catch (err: any) {
      if (err.code !== 'auth/cancelled-popup-request') {
        setError(err.message || 'Google authentication failed.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await emailLogin(email, password);
      } else if (mode === 'signup') {
        if (!name.trim()) throw new Error('Name is required');
        await emailSignup(email, password, name, invite?.role || 'viewer', inviteId || undefined);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 selection:bg-blue-100 selection:text-blue-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center text-slate-400 hover:text-slate-600 transition-colors group mb-8"
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-200">
            <Scale className="text-white w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {invite ? 'Join the Team' : mode === 'signup' ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-slate-500">
              {invite 
                ? `You've been invited to join LexisManage as an ${invite.role}` 
                : mode === 'signup' 
                  ? 'Join LexisManage today' 
                  : 'Sign in to access your legal dashboard'}
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">
          {inviteLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm text-slate-500 font-medium">Verifying invitation...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
            {mode === 'google' ? (
              <motion.div
                key="google-mode"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <button 
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all group shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <img 
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                    alt="Google" 
                    className="w-5 h-5"
                  />
                  <span>Sign in with Google</span>
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold text-slate-400">
                    <span className="bg-white px-4">Or use email</span>
                  </div>
                </div>

                <button 
                  onClick={() => setMode('login')}
                  className="w-full py-3 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Sign in with Email & Password
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="email-mode"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {mode === 'signup' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <span>{isSubmitting ? 'Processing...' : mode === 'signup' ? 'Create Account' : 'Sign In'}</span>
                  {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                </button>

                <div className="flex flex-col space-y-2 pt-2">
                  {invite && mode === 'signup' && (
                    <p className="text-xs text-center text-slate-400 py-2">
                      This account will be created for <strong>{invite.email}</strong>
                    </p>
                  )}
                  <button 
                    type="button"
                    onClick={() => setMode('google')}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Back to Google Sign In
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        )}

        <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-slate-900">Enterprise Ready</p>
                <p className="text-xs text-slate-500 mt-0.5">Your data is protected by bank-grade encryption and granular RBAC.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-slate-900">AI Powered</p>
                <p className="text-xs text-slate-500 mt-0.5">Access advanced legal intelligence and automated risk analysis.</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-slate-400 leading-relaxed">
              By signing in, you agree to our <br />
              <a href="#" className="text-blue-600 hover:underline font-medium">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline font-medium">Privacy Policy</a>.
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-center space-x-6 text-slate-400">
          <div className="flex items-center space-x-2">
            <Lock className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-widest">SSL Encrypted</span>
          </div>
          <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-widest">SOC2 Compliant</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
