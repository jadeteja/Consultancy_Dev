import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Briefcase, Bookmark, FileText, CheckCircle2, Save, Send } from 'lucide-react';
import { apiClient } from '../lib/api';
import { useAuth } from '../features/auth/AuthContext';
import { JobCard } from '../components/shared/JobCard';
import type { Job, ApplicationRecord } from '../types';

export const CandidateDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'profile' | 'applications' | 'saved'>('profile');

  // Fetch candidate profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['candidate-profile'],
    queryFn: async () => {
      const res = await apiClient.get('/candidate/profile');
      return res.data;
    },
  });

  // Fetch applications
  const { data: applicationsData } = useQuery({
    queryKey: ['candidate-applications'],
    queryFn: async () => {
      const res = await apiClient.get('/candidate/applications');
      return res.data;
    },
  });

  // Fetch saved jobs
  const { data: savedJobsData } = useQuery({
    queryKey: ['candidate-saved-jobs'],
    queryFn: async () => {
      const res = await apiClient.get('/candidate/saved-jobs');
      return res.data;
    },
  });

  // Profile Form state
  const [qualification, setQualification] = useState('');
  const [passoutYear, setPassoutYear] = useState('');
  const [preferredCategory, setPreferredCategory] = useState('IT');
  const [preferredLocation, setPreferredLocation] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [experienceYears, setExperienceYears] = useState('0');
  const [skills, setSkills] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  React.useEffect(() => {
    if (profile) {
      setQualification(profile.highestQualification || '');
      setPassoutYear(profile.passoutYear ? String(profile.passoutYear) : '');
      setPreferredCategory(profile.preferredCategory || 'IT');
      setPreferredLocation(profile.preferredLocation || '');
      setCurrentCity(profile.currentCity || '');
      setExperienceYears(profile.experienceYears ? String(profile.experienceYears) : '0');
      setSkills(profile.skills ? profile.skills.join(', ') : '');
    }
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        highestQualification: qualification,
        passoutYear: passoutYear ? parseInt(passoutYear, 10) : undefined,
        preferredCategory,
        preferredLocation,
        currentCity,
        experienceYears: parseFloat(experienceYears) || 0,
        skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      };
      const res = await apiClient.put('/candidate/profile', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-profile'] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Welcome Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0866D9] flex items-center justify-center font-bold text-xl">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Welcome, {profile?.userProfile?.fullName || user?.email?.split('@')[0]}
            </h1>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-blue-50/60 rounded-xl border border-blue-100 text-center">
            <span className="block text-base font-bold text-[#0866D9]">{applicationsData?.totalElements ?? 0}</span>
            <span className="text-[10px] uppercase font-semibold text-slate-500">Applications</span>
          </div>
          <div className="px-4 py-2 bg-purple-50/60 rounded-xl border border-purple-100 text-center">
            <span className="block text-base font-bold text-purple-700">{savedJobsData?.totalElements ?? 0}</span>
            <span className="text-[10px] uppercase font-semibold text-slate-500">Saved Jobs</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-6 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-1 text-xs font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'profile'
              ? 'border-[#0866D9] text-[#0866D9]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>My Profile & Skills</span>
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 px-1 text-xs font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'applications'
              ? 'border-[#0866D9] text-[#0866D9]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>My Applications ({applicationsData?.totalElements ?? 0})</span>
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-3 px-1 text-xs font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'saved'
              ? 'border-[#0866D9] text-[#0866D9]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved Jobs ({savedJobsData?.totalElements ?? 0})</span>
        </button>
      </div>

      {/* Tab 1: Profile Details */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-xs max-w-3xl">
          <div className="mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Career Profile Details</h2>
            <p className="text-xs text-slate-500">These details auto-populate when you apply via WhatsApp</p>
          </div>

          {saveSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Highest Qualification</label>
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="e.g. B.Tech (Computer Science)"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Passout Year</label>
                <input
                  type="number"
                  value={passoutYear}
                  onChange={(e) => setPassoutYear(e.target.value)}
                  placeholder="e.g. 2025"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Sector</label>
                <select
                  value={preferredCategory}
                  onChange={(e) => setPreferredCategory(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="IT">IT Jobs</option>
                  <option value="NON_IT">Non-IT Jobs</option>
                  <option value="SEMI_IT">Semi-IT Jobs</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Location</label>
                <input
                  type="text"
                  value={preferredLocation}
                  onChange={(e) => setPreferredLocation(e.target.value)}
                  placeholder="e.g. Hyderabad, Bangalore"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Current City</label>
                <input
                  type="text"
                  value={currentCity}
                  onChange={(e) => setCurrentCity(e.target.value)}
                  placeholder="e.g. Hyderabad"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Skills (comma separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. Java, Spring Boot, React, SQL, Git"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#0866D9] text-white font-semibold text-xs rounded-xl hover:bg-blue-700 shadow-sm transition-colors disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{updateProfileMutation.isPending ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Applications Tracker */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {applicationsData?.content && applicationsData.content.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse text-xs min-w-[550px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase">
                      <th className="py-3 px-4">Application #</th>
                      <th className="py-3 px-4">Job Role</th>
                      <th className="py-3 px-4">Company</th>
                      <th className="py-3 px-4">Applied Date</th>
                      <th className="py-3 px-4">Recruitment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applicationsData.content.map((app: ApplicationRecord) => (
                      <tr key={app.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-mono font-medium text-slate-700 whitespace-nowrap">{app.applicationNumber}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">{app.job?.title}</td>
                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{app.job?.companyName}</td>
                        <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{new Date(app.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-[#0866D9] border border-blue-100">
                            {app.recruitmentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
              <p className="text-sm font-semibold text-slate-800">You haven't submitted any applications yet.</p>
              <p className="text-xs text-slate-500 mt-1">Browse jobs and click "Apply via WhatsApp" to initiate applications.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Saved Jobs */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          {savedJobsData?.content && savedJobsData.content.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedJobsData.content.map((job: Job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
              <p className="text-sm font-semibold text-slate-800">No saved jobs yet.</p>
              <p className="text-xs text-slate-500 mt-1">Click the bookmark icon on any job card to save it for later.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
