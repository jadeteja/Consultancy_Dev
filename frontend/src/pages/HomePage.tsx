import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, ChevronRight, CheckCircle2, Shield, ArrowRight, Sparkles, Building2, Send } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import type { Job, Company } from '../types';
import { JobCard } from '../components/shared/JobCard';

export const HomePage: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (keyword) query.set('keyword', keyword);
    if (location) query.set('location', location);
    navigate(`/jobs?${query.toString()}`);
  };

  // Fetch recent jobs
  const { data: jobsData } = useQuery({
    queryKey: ['latest-jobs'],
    queryFn: async () => {
      const res = await apiClient.get('/jobs', { params: { size: 6 } });
      return res.data;
    },
  });

  // Fetch top companies
  const { data: companies } = useQuery<Company[]>({
    queryKey: ['companies'],
    queryFn: async () => {
      const res = await apiClient.get('/companies');
      return res.data;
    },
  });

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#EAF4FF]/80 via-[#F7FAFF] to-transparent pt-12 pb-20 border-b border-blue-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/70 text-[#0866D9] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Premier Recruitment Consultancy</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#102A56] tracking-tight leading-[1.15]">
                Your Career, <br />
                <span className="text-[#0866D9]">Our Guidance</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Discover the right career opportunities in <strong className="text-slate-800">IT, Non-IT</strong>, and <strong className="text-slate-800">Semi-IT</strong> sectors with personalized consultancy support and direct WhatsApp application.
              </p>

              {/* Search Bar Form */}
              <form onSubmit={handleSearch} className="bg-white p-2.5 rounded-2xl shadow-lg shadow-blue-500/5 border border-slate-200/80 flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex items-center gap-3 px-3">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Job title, skills, or company..."
                    className="w-full text-sm text-slate-800 focus:outline-hidden"
                  />
                </div>
                <div className="hidden sm:block w-px bg-slate-200 my-1" />
                <div className="sm:w-1/3 flex items-center gap-2 px-3">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location"
                    className="w-full text-sm text-slate-800 focus:outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#0866D9] hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 shrink-0 flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Jobs</span>
                </button>
              </form>

              {/* Quick Trust Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4">
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#0866D9] shrink-0" />
                  <span className="truncate">Verified Openings</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#0866D9] shrink-0" />
                  <span className="truncate">IT, Non-IT & Semi-IT</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0" />
                  <span className="truncate">WhatsApp Apply</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#0866D9] shrink-0" />
                  <span className="truncate">Zero Consultancy Fee</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Banner */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-tr from-blue-600 to-[#102A56] p-8 text-white flex flex-col justify-between min-h-[380px]">
                <div className="space-y-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider inline-block">
                    Direct WhatsApp Desk
                  </span>
                  <h3 className="text-2xl font-bold">Fast-Track Your Job Applications</h3>
                  <p className="text-sm text-blue-100 leading-relaxed">
                    Submit verified credentials in seconds and connect directly with senior corporate talent recruiters.
                  </p>
                </div>

                <div className="pt-6 border-t border-white/20 grid grid-cols-3 gap-2 text-center sm:text-left">
                  <div>
                    <span className="block text-xl sm:text-2xl font-bold">500+</span>
                    <span className="text-[11px] sm:text-xs text-blue-200">Openings</span>
                  </div>
                  <div>
                    <span className="block text-xl sm:text-2xl font-bold">50+</span>
                    <span className="text-[11px] sm:text-xs text-blue-200">Corporates</span>
                  </div>
                  <div>
                    <span className="block text-xl sm:text-2xl font-bold">98%</span>
                    <span className="text-[11px] sm:text-xs text-blue-200">Call Rate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Prominent Categories: IT, Non-IT, Semi-IT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#102A56] tracking-tight">Explore Opportunities</h2>
            <p className="text-sm text-slate-500 mt-1">Select your preferred sector to discover tailored openings</p>
          </div>
          <Link to="/jobs" className="text-xs sm:text-sm font-semibold text-[#0866D9] hover:underline flex items-center gap-1">
            <span>View All Jobs</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* IT Jobs */}
          <Link
            to="/jobs?category=IT"
            className="group bg-white p-7 rounded-2xl border border-slate-100 hover:border-blue-300 hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-xl bg-blue-50 text-[#0866D9] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[#0866D9] transition-colors">IT Jobs</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                Software Development, Testing, Cloud, DevOps, Data Analytics, Full-Stack & Cyber Security.
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-[#0866D9] gap-1 mt-4">
              <span>Explore IT Openings</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Non-IT Jobs */}
          <Link
            to="/jobs?category=NON_IT"
            className="group bg-white p-7 rounded-2xl border border-slate-100 hover:border-blue-300 hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">Non-IT Jobs</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                Human Resources, Finance & Accounts, Corporate Sales, Marketing, Administration & Management.
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-indigo-600 gap-1 mt-4">
              <span>Explore Non-IT Openings</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Semi-IT Jobs */}
          <Link
            to="/jobs?category=SEMI_IT"
            className="group bg-white p-7 rounded-2xl border border-slate-100 hover:border-blue-300 hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">Semi-IT Jobs</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                BPO, KPO, Technical Helpdesk, Process Associates, MIS Coordinators & IT Support Operations.
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-emerald-600 gap-1 mt-4">
              <span>Explore Semi-IT Openings</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* Top Hiring Companies */}
      {companies && companies.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-[#102A56]">Top Hiring Corporates</h2>
            <p className="text-xs text-slate-500 mt-1">Our certified recruitment partners actively screening candidates</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {companies.map((c) => (
              <div
                key={c.id}
                className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-center h-20 hover:border-blue-200 hover:shadow-xs transition-all"
              >
                {c.logoUrl ? (
                  <img src={c.logoUrl} alt={c.name} className="max-h-10 max-w-full object-contain" />
                ) : (
                  <span className="font-semibold text-xs text-slate-700 text-center">{c.name}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Latest Job Openings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#102A56] tracking-tight">Latest Job Openings</h2>
            <p className="text-sm text-slate-500 mt-1">Verified career opportunities freshly posted this week</p>
          </div>
          <Link to="/jobs" className="text-xs sm:text-sm font-semibold text-[#0866D9] hover:underline flex items-center gap-1">
            <span>Explore All Jobs</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobsData?.content?.map((job: Job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      {/* Why Choose Our Consultancy */}
      <section className="bg-white py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-[#102A56]">Why Job Seekers Rely On Us</h2>
            <p className="text-sm text-slate-500 mt-2">Professional guidance from profile review to final corporate placement</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0866D9] flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">Verified Real Job Openings</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every job posted is directly authorized by partnered corporate hiring managers. No fake postings or expired listings.
              </p>
            </div>

            <div className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#25D366] flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">Instant WhatsApp Routing</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Skip long form filling on corporate career sites. Send structured profiles straight to the assigned recruitment desk.
              </p>
            </div>

            <div className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">Free Candidate Placement</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Candidates never pay any fee or hidden charges. Our platform is 100% free for job seekers looking to build their future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#102A56] to-[#0866D9] rounded-3xl p-6 sm:p-12 text-white flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 sm:gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">Have questions about openings?</span>
            <h3 className="text-xl sm:text-3xl font-bold">Talk to our Career Advisory Desk</h3>
            <p className="text-xs sm:text-sm text-blue-100">
              Not sure which job category fits your passout year or qualification? Reach our team on WhatsApp for free guidance.
            </p>
          </div>
          <a
            href="https://wa.me/917285927080?text=Hello%20Next%20step%20solutions%2C%20I%20need%20career%20guidance"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-xl font-bold text-sm bg-[#25D366] hover:bg-emerald-600 text-white shadow-lg transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>Connect on WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
};
