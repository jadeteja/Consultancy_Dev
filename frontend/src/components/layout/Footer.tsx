import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone, MapPin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#102A56] text-white pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-700/60">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0866D9] flex items-center justify-center text-white">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Next step solutions</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Your career, our guidance. Connecting ambitious professionals with top opportunities across IT, Non-IT, and Semi-IT domains.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">Job Categories</h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li><Link to="/jobs?category=IT" className="hover:text-blue-400 transition-colors">IT & Software</Link></li>
              <li><Link to="/jobs?category=NON_IT" className="hover:text-blue-400 transition-colors">Non-IT & Management</Link></li>
              <li><Link to="/jobs?category=SEMI_IT" className="hover:text-blue-400 transition-colors">Semi-IT & Process Ops</Link></li>
              <li><Link to="/companies" className="hover:text-blue-400 transition-colors">Top Hiring Companies</Link></li>
            </ul>
          </div>

          {/* Consultancy */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">Candidate Corner</h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li><Link to="/jobs" className="hover:text-blue-400 transition-colors">Browse Job Openings</Link></li>
              <li><Link to="/register" className="hover:text-blue-400 transition-colors">Create Free Profile</Link></li>
              <li><Link to="/candidate" className="hover:text-blue-400 transition-colors">Track Applications</Link></li>
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">Placement Process</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">Head Office</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#0866D9] shrink-0 mt-0.5" />
                <span>Cyber Towers, HITEC City, Hyderabad, 500081</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#0866D9] shrink-0" />
                <span>+91 72859 27080</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#0866D9] shrink-0" />
                <span>nextstepsolutions.recruitment@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Next step solutions. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-slate-200 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-200 transition-colors">Terms of Service</Link>
            <span className="flex items-center gap-1">Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> for Job Seekers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
