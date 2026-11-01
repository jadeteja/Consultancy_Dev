import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Users, Briefcase, FileText, Settings, UserPlus, CheckCircle, BarChart3, PlusCircle } from 'lucide-react';
import { apiClient } from '../lib/api';
import type { Company, SiteSettings, ApplicationRecord } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'companies' | 'settings'>('analytics');

  // Stats query
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/dashboard');
      return res.data;
    },
  });

  // Users query
  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/users');
      return res.data;
    },
  });

  // Companies query
  const { data: companies } = useQuery<Company[]>({
    queryKey: ['companies'],
    queryFn: async () => {
      const res = await apiClient.get('/companies');
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  // Settings query
  const { data: siteSettings } = useQuery<SiteSettings>({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const res = await apiClient.get('/site-settings/public');
      return res.data;
    },
  });

  // Invite recruiter state
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [inviteMsg, setInviteMsg] = useState('');

  const assignRecruiterMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await apiClient.post('/admin/recruiters/assign', { email });
      return res.data;
    },
    onSuccess: (data) => {
      setInviteMsg(data.message || 'Recruiter role assigned!');
      setRecruiterEmail('');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setTimeout(() => setInviteMsg(''), 4000);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Failed to assign recruiter role. Ensure user exists first.');
    },
  });

  // Company creation state
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyIndustry, setNewCompanyIndustry] = useState('');
  const [newCompanyHq, setNewCompanyHq] = useState('');
  const [newCompanyLogo, setNewCompanyLogo] = useState('');

  const createCompanyMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: newCompanyName,
        industry: newCompanyIndustry,
        headquarters: newCompanyHq,
        logoUrl: newCompanyLogo,
      };
      const res = await apiClient.post('/admin/companies', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setNewCompanyName('');
      setNewCompanyIndustry('');
      setNewCompanyHq('');
      setNewCompanyLogo('');
    },
  });

  // Settings update state
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [portalName, setPortalName] = useState('');
  const [settingsSaved, setSettingsSaved] = useState(false);

  React.useEffect(() => {
    if (siteSettings) {
      setWhatsappNumber(siteSettings.whatsappNumber || '');
      setPortalName(siteSettings.portalName || '');
    }
  }, [siteSettings]);

  const updateSettingsMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        whatsappNumber,
        portalName,
      };
      const res = await apiClient.put('/admin/site-settings', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Super Admin Top Banner */}
      <div className="bg-gradient-to-r from-[#102A56] to-[#0866D9] p-6 rounded-2xl text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Super Administrator Console</span>
          </div>
          <h1 className="text-2xl font-bold">Next step solutions Master Administration</h1>
          <p className="text-xs text-blue-100 mt-1">Full control over recruiters, companies, live jobs, and system configurations</p>
          <div className="mt-3">
            <Link
              to="/recruiter"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-[#0866D9] text-xs font-bold shadow-xs hover:bg-blue-50 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post New Job (Recruiter Desk)</span>
            </Link>
          </div>
        </div>

        {/* Global Key Metrics */}
        <div className="grid grid-cols-3 sm:flex gap-2 sm:gap-4">
          <div className="bg-white/10 backdrop-blur-md px-3 sm:px-4 py-2 rounded-xl text-center">
            <span className="block text-lg sm:text-xl font-bold">{stats?.totalJobs ?? 0}</span>
            <span className="text-[10px] uppercase text-blue-200">Jobs</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-3 sm:px-4 py-2 rounded-xl text-center">
            <span className="block text-lg sm:text-xl font-bold">{stats?.totalApplications ?? 0}</span>
            <span className="text-[10px] uppercase text-blue-200">Apps</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-3 sm:px-4 py-2 rounded-xl text-center">
            <span className="block text-lg sm:text-xl font-bold">{stats?.totalCandidates ?? 0}</span>
            <span className="text-[10px] uppercase text-blue-200">Users</span>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-6 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 px-1 text-xs font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'analytics'
              ? 'border-[#0866D9] text-[#0866D9]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Dashboard Analytics</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-1 text-xs font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'users'
              ? 'border-[#0866D9] text-[#0866D9]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>User & Recruiter Management</span>
        </button>
        <button
          onClick={() => setActiveTab('companies')}
          className={`pb-3 px-1 text-xs font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'companies'
              ? 'border-[#0866D9] text-[#0866D9]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Partner Companies</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 px-1 text-xs font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'settings'
              ? 'border-[#0866D9] text-[#0866D9]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Site & WhatsApp Settings</span>
        </button>
      </div>

      {/* Tab 1: Analytics */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Openings by Category</h3>
            <div className="space-y-3">
              {stats?.jobsByCategory && Object.entries(stats.jobsByCategory).map(([cat, count]: any) => (
                <div key={cat} className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">{cat} Openings</span>
                  <span className="px-2.5 py-1 bg-blue-50 text-[#0866D9] font-bold rounded-lg">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Recruitment Funnel Overview</h3>
            <div className="space-y-3">
              {stats?.applicationsByStatus && Object.entries(stats.applicationsByStatus).map(([st, count]: any) => (
                <div key={st} className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">{st}</span>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Users & Recruiter Assignment */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Grant Recruiter Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs max-w-xl">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Grant Recruiter Permissions</h3>
            <p className="text-xs text-slate-500 mb-4">Promote any registered candidate to an authorized Recruiter</p>

            {inviteMsg && (
              <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{inviteMsg}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                assignRecruiterMutation.mutate(recruiterEmail);
              }}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="email"
                required
                value={recruiterEmail}
                onChange={(e) => setRecruiterEmail(e.target.value)}
                placeholder="registered.user@example.com"
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
              <button
                type="submit"
                disabled={assignRecruiterMutation.isPending}
                className="px-4 py-2.5 bg-[#0866D9] text-white font-semibold text-xs rounded-xl hover:bg-blue-700 transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
              >
                Assign Recruiter
              </button>
            </form>
          </div>

          {/* User Directory */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Registered System Accounts</h3>
            </div>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse text-xs min-w-[500px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase">
                    <th className="py-3 px-4">Full Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Assigned Roles</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users?.map((u: any) => (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-semibold text-slate-900">{u.fullName}</td>
                      <td className="py-3 px-4 text-slate-600 break-all">{u.email}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {u.roles?.map((r: any) => (
                            <span key={r.id} className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 whitespace-nowrap">
                              {r.name.replace('ROLE_', '')}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          {u.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Partner Companies */}
      {activeTab === 'companies' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Add Partner Corporate</h3>
            <form onSubmit={(e) => { e.preventDefault(); createCompanyMutation.mutate(); }} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  placeholder="e.g. Google India"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Industry</label>
                <input
                  type="text"
                  value={newCompanyIndustry}
                  onChange={(e) => setNewCompanyIndustry(e.target.value)}
                  placeholder="e.g. Technology"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Headquarters</label>
                <input
                  type="text"
                  value={newCompanyHq}
                  onChange={(e) => setNewCompanyHq(e.target.value)}
                  placeholder="e.g. Hyderabad"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Logo URL</label>
                <input
                  type="url"
                  value={newCompanyLogo}
                  onChange={(e) => setNewCompanyLogo(e.target.value)}
                  placeholder="https://..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <button
                type="submit"
                disabled={createCompanyMutation.isPending}
                className="w-full py-2.5 bg-[#0866D9] text-white font-semibold text-xs rounded-xl hover:bg-blue-700 transition-colors"
              >
                Add Company
              </button>
            </form>
          </div>

          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Active Hiring Companies ({companies?.length ?? 0})</h3>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {companies?.map((c) => (
                <div key={c.id} className="p-3 border border-slate-100 rounded-xl flex items-center gap-3">
                  {c.logoUrl && <img src={c.logoUrl} alt={c.name} className="w-10 h-10 object-contain shrink-0" />}
                  <div className="min-w-0">
                    <h4 className="font-semibold text-xs text-slate-900 truncate">{c.name}</h4>
                    <span className="text-[10px] text-slate-500 block truncate">{c.industry || 'Corporate'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Site Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs max-w-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Consultancy WhatsApp & Identity</h3>

          {settingsSaved && (
            <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); updateSettingsMutation.mutate(); }} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Portal Name</label>
              <input
                type="text"
                value={portalName}
                onChange={(e) => setPortalName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Official WhatsApp Phone (Country code + digits)</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="917285927080"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                All candidates clicking "Apply via WhatsApp" are redirected to this number.
              </span>
            </div>

            <button
              type="submit"
              disabled={updateSettingsMutation.isPending}
              className="px-6 py-2.5 bg-[#0866D9] text-white font-semibold text-xs rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Save Settings
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
