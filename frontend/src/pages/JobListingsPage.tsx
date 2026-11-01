import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiClient } from '../lib/api';
import type { Job } from '../types';
import { JobCard } from '../components/shared/JobCard';

export const JobListingsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || '');
  const [selectedWorkMode, setSelectedWorkMode] = useState(searchParams.get('workMode') || '');
  const [selectedPassoutYear, setSelectedPassoutYear] = useState(searchParams.get('passoutYear') || '');
  const [minSalary, setMinSalary] = useState(searchParams.get('minSalary') || '');
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['jobs', keyword, selectedCategory, selectedLocation, selectedWorkMode, selectedPassoutYear, minSalary, page],
    queryFn: async () => {
      const params: Record<string, any> = {
        page,
        size: 9,
      };
      if (keyword) params.keyword = keyword;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedLocation) params.location = selectedLocation;
      if (selectedWorkMode) params.workMode = selectedWorkMode;
      if (selectedPassoutYear) params.passoutYear = selectedPassoutYear;
      if (minSalary) params.minSalary = minSalary;

      const res = await apiClient.get('/jobs', { params });
      return res.data;
    },
  });

  const clearFilters = () => {
    setKeyword('');
    setSelectedCategory('');
    setSelectedLocation('');
    setSelectedWorkMode('');
    setSelectedPassoutYear('');
    setMinSalary('');
    setPage(0);
    setSearchParams({});
  };

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    const newParams: Record<string, string> = {};
    if (keyword) newParams.keyword = keyword;
    if (selectedCategory) newParams.category = selectedCategory;
    if (selectedLocation) newParams.location = selectedLocation;
    if (selectedWorkMode) newParams.workMode = selectedWorkMode;
    if (selectedPassoutYear) newParams.passoutYear = selectedPassoutYear;
    if (minSalary) newParams.minSalary = minSalary;
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner / Search bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-[#102A56]">Job Openings</h1>
          <p className="text-xs text-slate-500 mt-0.5">Find the right opportunity for your career growth</p>
        </div>

        <form onSubmit={handleApplyFilter} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-3 px-3.5 py-2 rounded-xl border border-slate-200">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search job title, company or keyword..."
              className="w-full text-xs text-slate-800 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition-colors cursor-pointer"
            >
              <Filter className="w-4 h-4 text-[#0866D9]" />
              <span>{mobileFilterOpen ? 'Hide Filters' : 'Filters'}</span>
            </button>
            <button
              type="submit"
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-[#0866D9] hover:bg-blue-700 text-white font-medium text-xs rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Main Grid: Filters Sidebar + Jobs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className={`space-y-6 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-[#0866D9]" />
                Filters
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs text-slate-500 hover:text-[#0866D9] cursor-pointer"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="lg:hidden text-slate-400 hover:text-slate-600 p-1"
                  aria-label="Close filters"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Job Type</label>
              <div className="space-y-1.5">
                {[
                  { label: 'All Categories', value: '' },
                  { label: 'IT Jobs', value: 'IT' },
                  { label: 'Non-IT Jobs', value: 'NON_IT' },
                  { label: 'Semi-IT Jobs', value: 'SEMI_IT' },
                ].map((cat) => (
                  <label key={cat.value} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="radio"
                      name="jobCategory"
                      value={cat.value}
                      checked={selectedCategory === cat.value}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="text-[#0866D9] focus:ring-[#0866D9]"
                    />
                    <span>{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
              >
                <option value="">All Locations</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Chennai">Chennai</option>
                <option value="Pune">Pune</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            {/* Work Mode Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Work Mode</label>
              <div className="space-y-1.5">
                {[
                  { label: 'All Modes', value: '' },
                  { label: 'On-site', value: 'ON_SITE' },
                  { label: 'Hybrid', value: 'HYBRID' },
                  { label: 'Remote', value: 'REMOTE' },
                ].map((mode) => (
                  <label key={mode.value} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="radio"
                      name="workMode"
                      value={mode.value}
                      checked={selectedWorkMode === mode.value}
                      onChange={(e) => setSelectedWorkMode(e.target.value)}
                      className="text-[#0866D9] focus:ring-[#0866D9]"
                    />
                    <span>{mode.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Passout Year Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Eligible Passout Year</label>
              <select
                value={selectedPassoutYear}
                onChange={(e) => setSelectedPassoutYear(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
              >
                <option value="">Any Year</option>
                <option value="2026">2026 Batch</option>
                <option value="2025">2025 Batch</option>
                <option value="2024">2024 Batch</option>
                <option value="2023">2023 Batch</option>
                <option value="2022">2022 Batch</option>
              </select>
            </div>

            {/* Salary Range Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Minimum Salary</label>
              <div className="space-y-1.5">
                {[
                  { label: 'Any Salary', value: '' },
                  { label: '3+ LPA', value: '300000' },
                  { label: '6+ LPA', value: '600000' },
                  { label: '10+ LPA', value: '1000000' },
                ].map((sal) => (
                  <label key={sal.value} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="radio"
                      name="minSalary"
                      value={sal.value}
                      checked={minSalary === sal.value}
                      onChange={(e) => setMinSalary(e.target.value)}
                      className="text-[#0866D9] focus:ring-[#0866D9]"
                    />
                    <span>{sal.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                handleApplyFilter(e);
                setMobileFilterOpen(false);
              }}
              className="w-full py-2 bg-[#0866D9] text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Showing {data?.totalElements ?? 0} job openings</span>
            <span>Sorted by: Latest</span>
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-slate-400 text-sm">Loading verified openings...</div>
          ) : data?.content && data.content.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.content.map((job: Job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
              <p className="text-base font-semibold text-slate-800">No jobs match your filter criteria</p>
              <p className="text-xs text-slate-500 mt-1">Try resetting filters or searching with a different term.</p>
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#0866D9] rounded-lg"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={data.first}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="p-2 rounded-lg border border-slate-200 bg-white disabled:opacity-40 text-slate-600 hover:bg-slate-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-600 font-medium px-3">
                Page {data.number + 1} of {data.totalPages}
              </span>
              <button
                disabled={data.last}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 rounded-lg border border-slate-200 bg-white disabled:opacity-40 text-slate-600 hover:bg-slate-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
