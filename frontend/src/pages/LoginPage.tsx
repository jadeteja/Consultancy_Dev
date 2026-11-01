import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, Mail, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
    } else {
      const knownAdmins = [
        'nextstepsolutions.recruitment@gmail.com',
        'jade.teja@gmail.com',
        'teja.jade@gmail.com',
        ...(import.meta.env.VITE_ADMIN_EMAIL ? import.meta.env.VITE_ADMIN_EMAIL.split(',') : [])
      ].map(e => e.trim().toLowerCase());

      if (knownAdmins.includes(email.trim().toLowerCase())) {
        navigate('/admin');
      } else {
        navigate('/candidate');
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-100 shadow-xl space-y-6">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0866D9]">Welcome Back</span>
          <h2 className="text-2xl font-bold text-[#102A56] mt-1">Sign In to Next step solutions</h2>
          <p className="text-xs text-slate-500 mt-1">Access saved jobs, applications, and your profile</p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="flex items-center px-3 py-2.5 rounded-xl border border-slate-200 focus-within:border-[#0866D9]">
              <Mail className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-xs text-slate-800 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="flex items-center px-3 py-2.5 rounded-xl border border-slate-200 focus-within:border-[#0866D9]">
              <Lock className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs text-slate-800 focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0866D9] text-white font-semibold text-xs rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-[#0866D9] font-semibold hover:underline">
            Register as Candidate
          </Link>
        </div>
      </div>
    </div>
  );
};
