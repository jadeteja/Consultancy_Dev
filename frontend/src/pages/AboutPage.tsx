import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Award, 
  Building2, 
  Target, 
  CheckCircle2, 
  Briefcase, 
  Send, 
  ShieldCheck, 
  Clock, 
  TrendingUp 
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="bg-linear-to-b from-white to-[#F7FAFF] border-b border-slate-100 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-[#0866D9] text-xs font-semibold tracking-wide uppercase">
              About Next Step Solutions
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#102A56] tracking-tight leading-tight">
              Bridging Talent with Opportunity Across India
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              We have placed about <span className="font-bold text-[#0866D9]">100+ job seekers over 3 years</span>, 
              empowering careers and providing top companies with high-performing professionals across IT, Non-IT, and Process Operations.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#0866D9] mb-1">100+</div>
              <div className="text-xs sm:text-sm font-medium text-slate-600">Job Seekers Placed</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#102A56] mb-1">3+</div>
              <div className="text-xs sm:text-sm font-medium text-slate-600">Years of Excellence</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 mb-1">50+</div>
              <div className="text-xs sm:text-sm font-medium text-slate-600">Hiring Partners</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-purple-600 mb-1">98%</div>
              <div className="text-xs sm:text-sm font-medium text-slate-600">Candidate Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story & Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0866D9]">Our Mission & Vision</span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#102A56] tracking-tight">
              Shaping Careers Through Personalized Recruitment & Mentorship
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Founded with the commitment to simplify the recruitment lifecycle, Next step solutions has spent the last 3 years transforming career pathways. In this time, we have successfully placed over 100+ aspiring job seekers into well-paying roles tailored to their educational qualifications, skill set, and long-term career aspirations.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              We eliminate endless job board scrolling by matching candidates directly with authenticated recruitment managers, offering continuous advisory and interview preparation along every step.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-sm text-slate-700 font-medium">Direct interview coordination with hiring authorities</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-sm text-slate-700 font-medium">Domain-tailored guidance across IT, Non-IT, & Semi-IT</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-sm text-slate-700 font-medium">Transparent, prompt communication via instant WhatsApp routing</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0866D9] flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Targeted Matching</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Precise evaluation of candidate skill sets against exact company job descriptions for maximum interview conversion.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#25D366] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">100+ Careers Built</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Over our 3 years of operation, our focus on quality matching has built trusted alumni across leading corporations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Partner Network</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Collaborating with leading enterprises, growth startups, and tech firms looking for verified candidates.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Swift Turnaround</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Real-time updates, scheduled feedback loops, and accelerated screening to keep your hiring progress moving forward.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values / Why Next Step Solutions */}
      <section className="bg-white py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0866D9]">Our Core Principles</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#102A56] mt-2">What Sets Us Apart</h2>
            <p className="text-sm text-slate-500 mt-2">
              Our 3-year journey has been driven by integrity, clear communication, and candidate-first values.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0866D9] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Authentic Opportunities</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every vacancy on our portal is vetted directly with hiring authorities. We ensure candidate resumes are presented to genuine decision makers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Continuous Support</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                From initial profile screening to resume optimization and final HR rounds, candidates receive continuous advisory from our experienced recruiters.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Proven Track Record</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Having successfully placed 100+ candidates in under 3 years across diverse roles, our placement methodology delivers tangible outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-r from-[#102A56] to-[#0866D9] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold">Ready to take your next career step?</h3>
            <p className="text-sm text-blue-100">
              Browse our latest openings or get in touch with our team directly for customized career counseling.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <Link
              to="/jobs"
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-white text-[#102A56] hover:bg-slate-100 transition-colors text-center"
            >
              Browse Openings
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-[#25D366] hover:bg-emerald-600 text-white shadow-lg transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
