'use client';

import React, { useState, useEffect } from 'react';
import { jobsService } from '@/services/appwrite/jobs';
import { JobListing } from '@/types';
import { Briefcase, MapPin, Clock, PlusCircle, MessageSquare, Mail, Search, CheckCircle2 } from 'lucide-react';

const JOB_CATEGORIES = [
  'Accounting & Finance',
  'Sales & Marketing',
  'Operations',
  'IT & Technical',
  'HR & Admin',
  'Healthcare',
  'Education & Training',
  'Other',
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');

  // Post Vacancy Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    category: 'Accounting & Finance',
    jobType: 'Full-Time' as const,
    urgency: 'Open' as const,
    salary: '',
    location: 'Jabalpur',
    description: '',
    skills: '',
    contactEmail: '',
    contactWhatsApp: '',
  });

  const loadJobs = () => {
    setLoading(true);
    jobsService.getJobs({ category: selectedCategory || undefined, activeOnly: true }).then((res) => {
      setJobs(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadJobs();
  }, [selectedCategory]);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await jobsService.createJob(formData);
    setPostSuccess(true);
    loadJobs();
    setTimeout(() => {
      setModalOpen(false);
      setPostSuccess(false);
      setFormData({
        title: '',
        company: '',
        category: 'Accounting & Finance',
        jobType: 'Full-Time',
        urgency: 'Open',
        salary: '',
        location: 'Jabalpur',
        description: '',
        skills: '',
        contactEmail: '',
        contactWhatsApp: '',
      });
    }, 2000);
  };

  const filteredJobs = jobs.filter((j) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      j.title.toLowerCase().includes(s) ||
      j.company.toLowerCase().includes(s) ||
      j.skills.toLowerCase().includes(s) ||
      j.location.toLowerCase().includes(s)
    );
  });

  return (
    <div className="bg-[#faf8f5] min-h-screen pb-20">
      {/* Header */}
      <section className="bg-[#07174a] text-white py-14 border-b-4 border-amber-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Community Employment Exchange
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-5xl font-bold text-white mt-1">
            Job Openings & Career Opportunities
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl">
            Verified positions posted by Agrawal member enterprises in Jabalpur. Build your professional career with trusted community businesses.
          </p>
        </div>
      </section>

      {/* Filter and Post Bar */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 shadow-xs sticky top-[65px] z-20">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search job title, skills…"
                className="w-full rounded-lg border border-slate-300 py-1.5 pl-9 pr-3 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-slate-300 py-1.5 px-3 text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="">All Job Categories</option>
              {JOB_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1540a8] hover:bg-[#07174a] text-white px-4 py-2 text-xs font-bold transition-all shadow cursor-pointer shrink-0"
          >
            <PlusCircle className="h-4 w-4" />
            <span>+ Post a Vacancy</span>
          </button>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-8">
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#1540a8] border-r-transparent" />
            <p className="mt-3 text-xs text-slate-500">Loading vacancies…</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center max-w-md mx-auto">
            <p className="text-xs text-slate-500">No vacancies matching this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {job.category}
                    </span>
                    {job.urgency === 'Urgent' && (
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        Urgent
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif-heading text-lg font-bold text-[#07174a]">
                    {job.title}
                  </h3>
                  <div className="text-xs font-bold text-amber-700 mt-0.5">
                    🏢 {job.company}
                  </div>

                  <div className="mt-3 space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="font-bold text-slate-800">💰 {job.salary}</div>
                    <div>📍 {job.location}</div>
                    <div>⏱ {job.jobType}</div>
                  </div>

                  <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                    {job.description}
                  </p>

                  {job.skills && (
                    <div className="mt-3 text-[11px] text-slate-500">
                      <strong>Skills:</strong> {job.skills}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {job.postedAt}
                  </span>

                  <div className="flex items-center gap-2">
                    {job.contactWhatsApp && (
                      <a
                        href={`https://wa.me/${job.contactWhatsApp.replace(/\D/g, '')}?text=Application%20for%20${encodeURIComponent(job.title)}%20at%20${encodeURIComponent(job.company)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                      >
                        <MessageSquare className="h-3 w-3" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                    {job.contactEmail && (
                      <a
                        href={`mailto:${job.contactEmail}?subject=Application:%20${encodeURIComponent(job.title)}`}
                        className="inline-flex items-center gap-1 rounded bg-[#1540a8] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#07174a]"
                      >
                        <Mail className="h-3 w-3" />
                        <span>Email</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Vacancy Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100"
            >
              ✕
            </button>

            <h3 className="font-serif-heading text-xl font-bold text-[#07174a]">
              Post a Job Vacancy
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Publish open job vacancies from your business to the community.
            </p>

            {postSuccess ? (
              <div className="rounded-lg bg-emerald-50 p-4 text-emerald-800 text-xs font-semibold text-center my-6">
                ✅ Job vacancy posted successfully!
              </div>
            ) : (
              <form onSubmit={handlePostSubmit} className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Senior Accountant (Tally ERP Lead)"
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Better Foods India"
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                    >
                      {JOB_CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Salary Range</label>
                    <input
                      type="text"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      placeholder="e.g. ₹20,000 – ₹30,000 / mo"
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Richhai / Civil Lines, Jabalpur"
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Responsibilities, experience needed, work hours…"
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Required Skills</label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="e.g. Tally Prime, GST, MS Excel, Driving License"
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      placeholder="hr@enterprise.com"
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">WhatsApp Number</label>
                    <input
                      type="tel"
                      value={formData.contactWhatsApp}
                      onChange={(e) => setFormData({ ...formData, contactWhatsApp: e.target.value })}
                      placeholder="9876543210"
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#1540a8] py-2.5 text-xs font-bold text-white hover:bg-[#07174a] transition-colors"
                >
                  Publish Job Vacancy
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
