import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { loginUser, registerUser, getCurrentUser, ensureDemoAccounts } from '@/lib/store';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Zap, Shield, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getCurrentUser()) {
      router.replace('/dashboard');
    }
    ensureDemoAccounts();
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isLogin) {
        loginUser(email, password);
      } else {
        const user = registerUser(name, email, password);
        loginUser(user.email, user.password);
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setError(null);
    setLoading(true);
    try {
      loginUser(demoEmail, demoPassword);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#faf8f4]">
      {/* 3D Ambient Background Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="clay-card-3d w-full max-w-md p-8 sm:p-10 relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-600/30 text-white font-black text-2xl group-hover:scale-105 transition-transform">
              🍃
            </div>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              SwachhApp
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-0.5">
              {isLogin ? 'Sign in to access your civic dashboard' : 'Join India’s Green Champion Network'}
            </p>
          </div>
        </div>

        {/* ── Demo Quick-Login for Judges ── */}
        <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <Zap size={13} className="text-amber-500 fill-amber-500" />
              <span>SIH Judge 1-Click Access</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-200/70 px-2 py-0.5 rounded-full">
              Demo Active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('citizen@demo.in', 'demo1234')}
              className="text-xs font-bold bg-white text-gray-800 hover:text-emerald-700 px-3 py-2.5 rounded-xl border border-emerald-200 hover:border-emerald-400 shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <span>👤 Citizen Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@demo.in', 'admin1234')}
              className="text-xs font-bold bg-white text-gray-800 hover:text-emerald-700 px-3 py-2.5 rounded-xl border border-emerald-200 hover:border-emerald-400 shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <Shield size={13} className="text-emerald-600" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-200 w-full" />
          <span className="bg-[#faf8f4] px-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest absolute">
            or credentials
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-extrabold text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="E.g., Harsha Vardhan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm shadow-inner"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-extrabold text-gray-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="citizen@swachhapp.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm shadow-inner"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-11 py-3 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full clay-btn-green text-white font-black py-3.5 text-sm flex items-center justify-center gap-2 shine-sweep-effect disabled:opacity-50"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Create Champion Profile'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer switch */}
        <div className="text-center text-xs font-bold text-gray-500 space-y-3 pt-2">
          <p>
            {isLogin ? "Don't have a profile yet? " : 'Already registered? '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-emerald-700 hover:underline font-extrabold"
            >
              {isLogin ? 'Create one now' : 'Sign In'}
            </button>
          </p>

          <Link href="/" className="inline-block text-gray-400 hover:text-gray-700">
            ← Return to Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}

