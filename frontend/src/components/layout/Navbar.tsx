import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';

export const Navbar: React.FC = () => {
  const { user, signOut, hasRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Jobs', path: '/jobs' },
    { name: 'Companies', path: '/companies' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const isLinkActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0866D9] flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-[#102A56] block leading-tight">Next step solutions</span>
            <span className="text-xs text-[#0866D9] font-medium tracking-wide">CONSULTANCY</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors ${
                isLinkActive(link.path)
                  ? 'text-[#0866D9] font-semibold'
                  : 'text-slate-600 hover:text-[#0866D9]'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Auth / Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              {hasRole('ROLE_SUPER_ADMIN') && (
                <Link
                  to="/admin"
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
                >
                  Admin Panel
                </Link>
              )}
              {hasRole('ROLE_RECRUITER') && (
                <Link
                  to="/recruiter"
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-[#0866D9] hover:bg-blue-100 transition-colors"
                >
                  Recruiter Desk
                </Link>
              )}
              <Link
                to="/candidate"
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5" />
                My Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                title="Log out"
                aria-label="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-5 py-2 text-sm font-medium text-slate-700 hover:text-[#0866D9] transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 text-sm font-medium text-white bg-[#0866D9] hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-600 hover:text-slate-900 focus:outline-hidden rounded-lg cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-100 bg-white px-4 pt-2 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2.5 px-2 text-base font-medium rounded-lg transition-colors ${
                isLinkActive(link.path)
                  ? 'text-[#0866D9] bg-blue-50/60 font-semibold'
                  : 'text-slate-700 hover:text-[#0866D9] hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                {hasRole('ROLE_SUPER_ADMIN') && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 px-4 rounded-lg bg-purple-50 text-purple-700 font-semibold text-sm hover:bg-purple-100 transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}
                {hasRole('ROLE_RECRUITER') && (
                  <Link
                    to="/recruiter"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 px-4 rounded-lg bg-blue-50 text-[#0866D9] font-semibold text-sm hover:bg-blue-100 transition-colors"
                  >
                    Recruiter Desk
                  </Link>
                )}
                <Link
                  to="/candidate"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-4 rounded-lg border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
                >
                  Candidate Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center py-2.5 px-4 rounded-lg border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-4 rounded-lg border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-4 rounded-lg bg-[#0866D9] text-white font-medium text-sm hover:bg-blue-700 shadow-sm transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
