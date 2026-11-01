import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Users, Briefcase, FileText, Settings, UserPlus, CheckCircle, AlertCircle, BarChart3, PlusCircle, Edit2, Trash2, X } from 'lucide-react';
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

  // Company creation & editing state
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyIndustry, setNewCompanyIndustry] = useState('');
  const [newCompanyHq, setNewCompanyHq] = useState('');
  const [newCompanyLogo, setNewCompanyLogo] = useState('');
  const [companySuccessMsg, setCompanySuccessMsg] = useState('');
  const [companyErrorMsg, setCompanyErrorMsg] = useState('');
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const createCompanyMutation = useMutation({
    mutationFn: async () => {
      setCompanyErrorMsg('');
      setCompanySuccessMsg('');

      let cleanLogo = newCompanyLogo.trim();
      if (cleanLogo && !cleanLogo.startsWith('http://') && !cleanLogo.startsWith('https://')) {
        cleanLogo = `https://${cleanLogo}`;
      }

      const payload = {
        name: newCompanyName.trim(),
        industry: newCompanyIndustry.trim() || undefined,
        headquarters: newCompanyHq.trim() || undefined,
        logoUrl: cleanLogo || undefined,
      };

      try {
        const res = await apiClient.post('/admin/companies', payload);
        return res.data;
      } catch (err: any) {
        // Fallback to /companies if /admin/companies returns 404
        if (err.response?.status === 404) {
          const fallbackRes = await apiClient.post('/companies', payload);
          return fallbackRes.data;
        }
        throw err;
      }
    },
    onSuccess: (data) => {
      setCompanySuccessMsg(`Company "${data.name || newCompanyName}" added successfully!`);
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setNewCompanyName('');
      setNewCompanyIndustry('');
      setNewCompanyHq('');
      setNewCompanyLogo('');
      setTimeout(() => setCompanySuccessMsg(''), 4000);
    },
    onError: (err: any) => {
      let msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to add company. Please verify your connection and permissions.';
      if (err.response?.status === 405) {
        msg = 'Error 405: VITE_API_BASE_URL is not set in Vercel. Requests are hitting Vercel static hosting instead of your Render backend. Set VITE_API_BASE_URL in Vercel settings and redeploy.';
      }
      setCompanyErrorMsg(typeof msg === 'string' ? msg : JSON.stringify(msg));
    },
  });

  const updateCompanyMutation = useMutation({
    mutationFn: async () => {
      if (!editingCompany) return;
      setCompanyErrorMsg('');
      setCompanySuccessMsg('');

      let cleanLogo = newCompanyLogo.trim();
      if (cleanLogo && !cleanLogo.startsWith('http://') && !cleanLogo.startsWith('https://')) {
        cleanLogo = `https://${cleanLogo}`;
      }

      const payload = {
        name: newCompanyName.trim(),
        industry: newCompanyIndustry.trim() || undefined,
        headquarters: newCompanyHq.trim() || undefined,
        logoUrl: cleanLogo || undefined,
      };

      const res = await apiClient.put(`/companies/${editingCompany.id}`, payload);
      return res.data;
    },
    onSuccess: (data) => {
      setCompanySuccessMsg(`Company "${data.name || newCompanyName}" updated successfully!`);
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      cancelEditingCompany();
      setTimeout(() => setCompanySuccessMsg(''), 4000);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to update company.';
      setCompanyErrorMsg(typeof msg === 'string' ? msg : JSON.stringify(msg));
    },
  });

  const deleteCompanyMutation = useMutation({
    mutationFn: async (companyId: string) => {
      setCompanyErrorMsg('');
      setCompanySuccessMsg('');
      const res = await apiClient.delete(`/companies/${companyId}`);
      return res.data;
    },
    onSuccess: (data) => {
      setCompanySuccessMsg(data.message || 'Company deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      if (editingCompany) {
        cancelEditingCompany();
      }
      setTimeout(() => setCompanySuccessMsg(''), 4000);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to delete company.';
      setCompanyErrorMsg(typeof msg === 'string' ? msg : JSON.stringify(msg));
    },
  });

  const startEditingCompany = (c: Company) => {
    setEditingCompany(c);
    setNewCompanyName(c.name || '');
    setNewCompanyIndustry(c.industry || '');
    setNewCompanyHq(c.headquarters || '');
    setNewCompanyLogo(c.logoUrl || '');
    setCompanyErrorMsg('');
    setCompanySuccessMsg('');
  };

  const cancelEditingCompany = () => {
    setEditingCompany(null);
    setNewCompanyName('');
    setNewCompanyIndustry('');
    setNewCompanyHq('');
    setNewCompanyLogo('');
  };

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
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {editingCompany ? 'Edit Partner Corporate' : 'Add Partner Corporate'}
              </h3>
              {editingCompany && (
                <button
                  type="button"
                  onClick={cancelEditingCompany}
                  className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              )}
            </div>

            {companySuccessMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{companySuccessMsg}</span>
              </div>
            )}

            {companyErrorMsg && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{companyErrorMsg}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newCompanyName.trim()) return;
                if (editingCompany) {
                  updateCompanyMutation.mutate();
                } else {
                  createCompanyMutation.mutate();
                }
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  placeholder="e.g. Google India"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0866D9]/20 focus:border-[#0866D9]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Industry</label>
                <input
                  type="text"
                  value={newCompanyIndustry}
                  onChange={(e) => setNewCompanyIndustry(e.target.value)}
                  placeholder="e.g. Technology"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0866D9]/20 focus:border-[#0866D9]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Headquarters</label>
                <input
                  type="text"
                  value={newCompanyHq}
                  onChange={(e) => setNewCompanyHq(e.target.value)}
                  placeholder="e.g. Hyderabad"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0866D9]/20 focus:border-[#0866D9]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Logo URL</label>
                <input
                  type="text"
                  value={newCompanyLogo}
                  onChange={(e) => setNewCompanyLogo(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0866D9]/20 focus:border-[#0866D9]"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={
                    (editingCompany ? updateCompanyMutation.isPending : createCompanyMutation.isPending) ||
                    !newCompanyName.trim()
                  }
                  className="flex-1 py-2.5 bg-[#0866D9] text-white font-semibold text-xs rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {editingCompany ? (
                    updateCompanyMutation.isPending ? 'Updating...' : 'Save Changes'
                  ) : createCompanyMutation.isPending ? (
                    'Adding Company...'
                  ) : (
                    'Add Company'
                  )}
                </button>
                {editingCompany && (
                  <button
                    type="button"
                    onClick={cancelEditingCompany}
                    className="px-3 py-2.5 border border-slate-200 text-slate-600 font-semibold text-xs rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Active Hiring Companies ({companies?.length ?? 0})</h3>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {companies?.map((c) => (
                <div
                  key={c.id}
                  className={`p-3 border rounded-xl flex items-center justify-between gap-3 transition-colors ${
                    editingCompany?.id === c.id ? 'border-[#0866D9] bg-blue-50/30' : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {c.logoUrl ? (
                      <img
                        src={c.logoUrl}
                        alt={c.name}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.style.display = 'none';
                        }}
                        className="w-10 h-10 object-contain shrink-0 rounded bg-white p-0.5 border border-slate-100"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-blue-50 text-[#0866D9] flex items-center justify-center font-bold text-xs shrink-0">
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs text-slate-900 truncate">{c.name}</h4>
                      <span className="text-[10px] text-slate-500 block truncate">{c.industry || 'Corporate'}</span>
                      {c.headquarters && (
                        <span className="text-[10px] text-slate-400 block truncate">{c.headquarters}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEditingCompany(c)}
                      title="Edit Company"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-[#0866D9] hover:bg-blue-50 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete "${c.name}"?`)) {
                          deleteCompanyMutation.mutate(c.id);
                        }
                      }}
                      title="Delete Company"
                      disabled={deleteCompanyMutation.isPending}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
