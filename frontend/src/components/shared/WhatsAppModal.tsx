import React, { useState } from 'react';
import { X, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../../lib/api';
import type { Job } from '../../types';

interface WhatsAppModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({ job, isOpen, onClose }) => {
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [qualification, setQualification] = useState('');
  const [passoutYear, setPassoutYear] = useState('');
  const [preferredCategory, setPreferredCategory] = useState(job.jobCategory || 'IT');
  const [preferredLocation, setPreferredLocation] = useState(job.location || '');
  const [experienceLevel, setExperienceLevel] = useState('Fresher (0 Years)');
  const [currentCity, setCurrentCity] = useState('');
  const [consent, setConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      alert('Please agree to share your application details.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        jobId: job.id,
        applicantName: fullName,
        applicantMobile: mobileNumber,
        applicantEmail: email,
        highestQualification: qualification,
        passoutYear: passoutYear ? parseInt(passoutYear, 10) : undefined,
        preferredCategory,
        preferredLocation,
        experienceLevel,
        currentCity,
        consentGiven: consent,
      };

      const res = await apiClient.post('/applications/guest-intent', payload);
      const { whatsappUrl } = res.data;

      // Open WhatsApp in a new window/tab
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      onClose();
    } catch (err) {
      console.error('Error submitting application intent', err);
      alert('Could not initiate application. Please check your network and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0866D9] to-[#102A56] p-4 sm:p-6 text-white flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-blue-200 block">Official WhatsApp Application</span>
            <h3 className="text-lg sm:text-xl font-bold mt-1 truncate">Apply for {job.title}</h3>
            <p className="text-xs text-blue-100 mt-0.5 truncate">{job.companyName} • {job.location}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#0866D9] focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile / WhatsApp Number *</label>
              <input
                type="tel"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#0866D9] focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@example.com"
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#0866D9] focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current City *</label>
              <input
                type="text"
                required
                value={currentCity}
                onChange={(e) => setCurrentCity(e.target.value)}
                placeholder="e.g. Hyderabad"
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#0866D9] focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Highest Qualification</label>
              <select
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="w-full text-sm px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#0866D9] bg-white"
              >
                <option value="">Select Qualification</option>
                <option value="B.Tech / B.E">B.Tech / B.E</option>
                <option value="MCA / M.Tech">MCA / M.Tech</option>
                <option value="MBA / PGDM">MBA / PGDM</option>
                <option value="B.Sc / BCA">B.Sc / BCA</option>
                <option value="B.Com / BBA">B.Com / BBA</option>
                <option value="Other Graduate">Other Graduate</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Passout Year</label>
              <select
                value={passoutYear}
                onChange={(e) => setPassoutYear(e.target.value)}
                className="w-full text-sm px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#0866D9] bg-white"
              >
                <option value="">Select Year</option>
                <option value="2026">2026 (Upcoming)</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021 or earlier</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full text-sm px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#0866D9] bg-white"
              >
                <option value="Fresher (0 Years)">Fresher (0 Years)</option>
                <option value="1 - 2 Years">1 - 2 Years</option>
                <option value="2 - 5 Years">2 - 5 Years</option>
                <option value="5+ Years">5+ Years</option>
              </select>
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 rounded text-[#0866D9] focus:ring-[#0866D9]"
              />
              <span>
                I authorize Next step solutions to share my submitted application data with the employer and contact me regarding this opening.
              </span>
            </label>
          </div>

          {/* Info note */}
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center gap-2.5 text-xs text-blue-800">
            <ShieldCheck className="w-4 h-4 text-[#0866D9] shrink-0" />
            <span>Clicking below will format your job application and open our official WhatsApp desk.</span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-[#25D366] hover:bg-emerald-600 rounded-lg shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Initiating...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Continue to WhatsApp</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
