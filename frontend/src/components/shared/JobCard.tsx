import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, IndianRupee, Clock, Bookmark, Send } from 'lucide-react';
import type { Job } from '../../types';
import { WhatsAppModal } from './WhatsAppModal';
import { useAuth } from '../../features/auth/AuthContext';
import { apiClient } from '../../lib/api';

interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { user } = useAuth();

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in as a candidate to save jobs to your profile.');
      return;
    }
    try {
      if (isSaved) {
        await apiClient.delete(`/candidate/saved-jobs/${job.id}`);
        setIsSaved(false);
      } else {
        await apiClient.post('/candidate/saved-jobs', { jobId: job.id });
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Error toggling saved job', err);
    }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Best in Industry';
    const minLPA = min ? (min / 100000).toFixed(1) : '0';
    const maxLPA = max ? (max / 100000).toFixed(1) : '';
    return `₹ ${minLPA}${maxLPA ? ` - ${maxLPA}` : '+'} LPA`;
  };

  return (
    <>
      <div className="bg-white rounded-xl p-5 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
        <div>
          {/* Header row with logo and title */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center p-2 shrink-0">
                {job.companyLogoUrl ? (
                  <img src={job.companyLogoUrl} alt={job.companyName} className="max-w-full max-h-full object-contain" />
                ) : (
                  <Briefcase className="w-6 h-6 text-[#0866D9]" />
                )}
              </div>
              <div>
                <Link to={`/jobs/${job.slug}`} className="font-semibold text-slate-900 hover:text-[#0866D9] text-base leading-snug block line-clamp-1">
                  {job.title}
                </Link>
                <span className="text-xs text-slate-500 font-medium">{job.companyName}</span>
              </div>
            </div>

            <button
              onClick={handleSave}
              className={`p-2 rounded-lg transition-colors ${
                isSaved ? 'text-[#0866D9] bg-blue-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
              title={isSaved ? 'Saved' : 'Save Job'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Key tags: Experience, Location, Type */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {job.minExperience ?? 0} - {job.maxExperience ?? 2} Yrs
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {job.location}
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-700">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
              {formatSalary(job.minSalary, job.maxSalary)}
            </span>
          </div>

          {/* Skills chips */}
          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {job.requiredSkills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 text-slate-700 rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action row */}
        <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <Link
            to={`/jobs/${job.slug}`}
            className="text-xs font-semibold text-[#0866D9] hover:underline"
          >
            View Details
          </Link>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#25D366] hover:bg-emerald-600 rounded-lg shadow-xs transition-colors"
          >
            <Send className="w-3 h-3" />
            <span>Apply via WhatsApp</span>
          </button>
        </div>
      </div>

      <WhatsAppModal job={job} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
