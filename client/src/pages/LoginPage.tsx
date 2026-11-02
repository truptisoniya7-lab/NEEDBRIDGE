import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HandHeart, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-stone-200/90 p-8 shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-teal-700 text-white rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <HandHeart className="w-6 h-6 text-teal-100" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-black text-[#14201F] tracking-tight">Welcome Back</h1>
          <p className="text-xs text-stone-500">Sign in to your NEEDBRIDGE mutual aid account</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl flex items-start gap-2.5 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" aria-hidden="true" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="w-full pl-9 pr-4 py-2.5 bg-[#FAFAF7] border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-700 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" aria-hidden="true" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-9 pr-4 py-2.5 bg-[#FAFAF7] border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-700 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 disabled:bg-teal-400 text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-teal-800"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </form>

        <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-teal-800 font-bold hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};
