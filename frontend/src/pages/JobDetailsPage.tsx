import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, MapPin, Briefcase, IndianRupee, Clock, Share2, Bookmark, CheckCircle2, Building, Send } from 'lucide-react';
import { apiClient } from '../lib/api';
import type { Job } from '../types';
import { WhatsAppModal } from '../components/shared/WhatsAppModal';
import { useAuth } from '../features/auth/AuthContext';

export const JobDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [modalOpen, setModalOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const { user } = useAuth();

  const { data: job, isLoading, error } = useQuery<Job>({
    queryKey: ['job', slug],
    queryFn: async () => {
      const res = await apiClient.get(`/jobs/${slug}`);
      return res.data;
    },
    enabled: !!slug,
  });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job?.title,
          text: `Check out this opening for ${job?.title} at ${job?.companyName}`,
          url: window.location.href,
        });
      } catch {
        // Ignored if user dismissed share dialog
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Job URL copied to clipboard!');
    }
  };

  const handleSave = async () => {
    if (!user) {
      alert('Please log in as a candidate to save this job.');
      return;
    }
    try {
      if (saved) {
        await apiClient.delete(`/candidate/saved-jobs/${job?.id}`);
        setSaved(false);
      } else {
        await apiClient.post('/candidate/saved-jobs', { jobId: job?.id });
        setSaved(true);
      }
    } catch (err) {
      console.error('Error toggling saved job', err);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center text-slate-500">
        Loading job opening details...
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Job Opening Not Found</h2>
        <p className="text-sm text-slate-500">This job may have been closed, expired, or removed.</p>
        <Link to="/jobs" className="inline-block px-5 py-2.5 bg-[#0866D9] text-white rounded-lg text-xs font-semibold">
          Browse Active Jobs
        </Link>
      </div>
    );
  }

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Best in Industry';
    const minLPA = min ? (min / 100000).toFixed(1) : '0';
    const maxLPA = max ? (max / 100000).toFixed(1) : '';
    return `₹ ${minLPA}${maxLPA ? ` - ${maxLPA}` : '+'} LPA`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link to="/jobs" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0866D9]">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jobs</span>
        </Link>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center shrink-0">
              {job.companyLogoUrl ? (
                <img src={job.companyLogoUrl} alt={job.companyName} className="max-w-full max-h-full object-contain" />
              ) : (
                <Building className="w-8 h-8 text-[#0866D9]" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 break-words">{job.title}</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100 whitespace-nowrap">
                  {job.status}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-600 mt-1">{job.companyName}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSave}
              className={`p-2.5 rounded-xl border border-slate-200 transition-colors cursor-pointer ${
                saved ? 'text-[#0866D9] bg-blue-50 border-blue-200' : 'text-slate-600 hover:bg-slate-50'
              }`}
              title="Save Job"
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Share Job"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-[#25D366] hover:bg-emerald-600 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Apply via WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Highlight row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Experience</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">{job.minExperience ?? 0} - {job.maxExperience ?? 2} Years</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Salary Package</span>
            <span className="font-semibold text-emerald-600 mt-0.5 block">{formatSalary(job.minSalary, job.maxSalary)}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Location & Mode</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">{job.location} ({job.workMode})</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Job Category</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">{job.jobCategory} Sector</span>
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Description, Responsibilities, Skills */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Job Description</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>

          {job.responsibilities && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Key Responsibilities</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{job.responsibilities}</p>
            </div>
          )}

          {job.requirements && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Requirements & Eligibility</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{job.requirements}</p>
            </div>
          )}

          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Required Technical / Domain Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill) => (
                  <span key={skill} className="px-3 py-1.5 bg-blue-50 text-[#0866D9] font-medium text-xs rounded-lg">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Key Job Metadata & Consultancy Guarantee */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Job Overview</h3>
            <ul className="space-y-3 text-xs">
              <li className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Job Code</span>
                <span className="font-semibold text-slate-800">{job.jobCode}</span>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Employment Type</span>
                <span className="font-semibold text-slate-800">{job.employmentType}</span>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Min Qualification</span>
                <span className="font-semibold text-slate-800">{job.minQualification || 'Any Graduate'}</span>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Eligible Batches</span>
                <span className="font-semibold text-slate-800">{job.eligiblePassoutYears || 'Open to All'}</span>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Vacancies</span>
                <span className="font-semibold text-slate-800">{job.vacancies} Positions</span>
              </li>
              {job.applicationDeadline && (
                <li className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Deadline</span>
                  <span className="font-semibold text-red-600">{job.applicationDeadline}</span>
                </li>
              )}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-[#EAF4FF] p-6 rounded-2xl border border-blue-100 space-y-3">
            <div className="flex items-center gap-2 text-[#0866D9] font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Next step solutions Support</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              When applying via WhatsApp, our consultancy screening team verifies your details within 24 hours and arranges direct employer interview calls.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="w-full py-2.5 bg-[#25D366] text-white font-semibold text-xs rounded-xl shadow-xs hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Apply via WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      <WhatsAppModal job={job} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};
