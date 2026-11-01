import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Briefcase, Users, PlusCircle, CheckCircle, Clock } from 'lucide-react';
import { apiClient } from '../lib/api';
import type { ApplicationRecord, Company } from '../types';

export const RecruiterDashboardPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'applications' | 'post-job'>('applications');

  // Job creation form state
  const [title, setTitle] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [jobCategory, setJobCategory] = useState<'IT' | 'NON_IT' | 'SEMI_IT'>('IT');
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState('HYBRID');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [minExp, setMinExp] = useState('0');
  const [maxExp, setMaxExp] = useState('2');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [postSuccess, setPostSuccess] = useState(false);

  // Fetch companies
  const { data: companies } = useQuery<Company[]>({
    queryKey: ['companies'],
    queryFn: async () => {
      const res = await apiClient.get('/companies');
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  // Fetch applications assigned to recruiter
  const { data: applicationsData, isLoading: appsLoading } = useQuery({
    queryKey: ['recruiter-applications'],
    queryFn: async () => {
      const res = await apiClient.get('/recruiter/applications');
      return res.data;
    },
  });

  const createJobMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title,
        companyId,
        jobCategory,
        location,
        workMode,
        minSalary: minSalary ? parseFloat(minSalary) : undefined,
        maxSalary: maxSalary ? parseFloat(maxSalary) : undefined,
        minExperience: parseFloat(minExp),
        maxExperience: parseFloat(maxExp),
        description,
        requiredSkills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      };
      const res = await apiClient.post('/recruiter/jobs', payload);
      return res.data;
    },
    onSuccess: () => {
      setPostSuccess(true);
      setTitle('');
      setDescription('');
      setSkills('');
      setTimeout(() => setPostSuccess(false), 3000);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ appId, status }: { appId: string; status: string }) => {
      await apiClient.patch(`/recruiter/applications/${appId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter-applications'] });
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Recruiter Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#0866D9]">Recruiter Workspace</span>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">Recruiter Operations Desk</h1>
          <p className="text-xs text-slate-500">Screen candidates and post authorized vacancies</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'applications'
                ? 'bg-[#0866D9] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Review Applications
          </button>
          <button
            onClick={() => setActiveTab('post-job')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'post-job'
                ? 'bg-[#0866D9] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Post New Job</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Review Applications */}
      {activeTab === 'applications' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Received WhatsApp Candidate Inquiries</h3>
            <p className="text-xs text-slate-500">Review submissions and update recruitment screening stages</p>
          </div>

          {appsLoading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading candidate applications...</div>
          ) : applicationsData?.content && applicationsData.content.length > 0 ? (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse text-xs min-w-[650px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase">
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Job Role</th>
                    <th className="py-3 px-4">Mobile / Email</th>
                    <th className="py-3 px-4">Qualification & Batch</th>
                    <th className="py-3 px-4">Status Stage</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applicationsData.content.map((app: ApplicationRecord) => (
                    <tr key={app.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">{app.applicantName}</td>
                      <td className="py-3 px-4 text-slate-700 whitespace-nowrap">{app.job?.title}</td>
                      <td className="py-3 px-4 text-slate-500">
                        <div>{app.applicantMobile}</div>
                        <div className="text-[11px] text-slate-400 break-all">{app.applicantEmail}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        {app.highestQualification || 'Graduate'} {app.passoutYear ? `(${app.passoutYear})` : ''}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-[#0866D9] border border-blue-100">
                          {app.recruitmentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <select
                          value={app.recruitmentStatus}
                          onChange={(e) => updateStatusMutation.mutate({ appId: app.id, status: e.target.value })}
                          className="text-xs px-2 py-1 rounded border border-slate-200 bg-white"
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="SCREENING">SCREENING</option>
                          <option value="SHORTLISTED">SHORTLISTED</option>
                          <option value="INTERVIEW_SCHEDULED">INTERVIEW_SCHEDULED</option>
                          <option value="SELECTED">SELECTED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500">
              No applications received yet for your assigned postings.
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Post Job Form */}
      {activeTab === 'post-job' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-xs max-w-3xl">
          <div className="mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Publish Authorized Vacancy</h2>
            <p className="text-xs text-slate-500">Directly published to live candidates on Next step solutions</p>
          </div>

          {postSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Job opening successfully posted and published!</span>
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); createJobMutation.mutate(); }} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Java Full Stack Developer"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hiring Company *</label>
                <select
                  required
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="">Select Partner Company</option>
                  {companies?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sector Category *</label>
                <select
                  value={jobCategory}
                  onChange={(e) => setJobCategory(e.target.value as any)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="IT">IT Jobs</option>
                  <option value="NON_IT">Non-IT Jobs</option>
                  <option value="SEMI_IT">Semi-IT Jobs</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location *</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Hyderabad"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Work Mode</label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="ON_SITE">On-site</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="REMOTE">Remote</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Min Salary (Annual INR)</label>
                <input
                  type="number"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                  placeholder="e.g. 500000"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Max Salary (Annual INR)</label>
                <input
                  type="number"
                  value={maxSalary}
                  onChange={(e) => setMaxSalary(e.target.value)}
                  placeholder="e.g. 900000"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Required Skills (comma separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. Java, Spring Boot, MySQL, REST"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Job Description *</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe role responsibilities and eligibility criteria..."
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={createJobMutation.isPending}
                className="px-6 py-2.5 bg-[#0866D9] text-white font-semibold text-xs rounded-xl hover:bg-blue-700 shadow-sm transition-colors disabled:opacity-50"
              >
                {createJobMutation.isPending ? 'Publishing...' : 'Publish Job'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
