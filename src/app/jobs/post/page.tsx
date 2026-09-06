'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { jobsService } from '@/services/appwrite/jobs';
import { Briefcase, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';

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

export default function PostJobPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    category: 'Accounting & Finance',
    jobType: 'Full-Time' as 'Full-Time' | 'Part-Time' | 'Contract' | 'Internship',
    urgency: 'Open' as 'Open' | 'Urgent',
    salary: '₹25,000 – ₹35,000 / month',
    location: 'Jabalpur, MP',
    description: '',
    skills: '',
    contactEmail: '',
    contactWhatsApp: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await jobsService.createJob(formData);
      setSuccess(true);
      setTimeout(() => {
        router.push('/jobs');
      }, 1800);
    } catch (err) {
      console.error('Job post error:', err);
      alert('Failed to submit vacancy. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#faf8f5] min-h-screen py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="mb-6">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1540a8] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Job Exchange</span>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-5 mb-6">
            <div className="relative h-12 w-12 rounded-xl overflow-hidden shadow-sm shrink-0 border border-amber-400/50 bg-white p-1">
              <Image
                src="/images/acci_logo.jpg"
                alt="ACCI Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                Community Recruitment
              </span>
              <h1 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#07174a]">
                Post a Job Vacancy
              </h1>
              <p className="text-xs text-slate-500">
                Connect directly with qualified professionals and talent across the Agrawal community.
              </p>
            </div>
          </div>

          {success ? (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h3 className="font-serif-heading text-xl font-bold text-[#07174a]">
                Vacancy Published Successfully!
              </h3>
              <p className="text-xs text-slate-600 mt-2">
                Your opening is now live on the ACCI Jabalpur Career Board. Redirecting to job board…
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Job Title / Role *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Accountant & Tally Lead"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Hiring Enterprise / Company *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Agrawal Jewellers & Sons"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                  >
                    {JOB_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Job Type</label>
                  <select
                    value={formData.jobType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        jobType: e.target.value as 'Full-Time' | 'Part-Time' | 'Contract' | 'Internship',
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hiring Urgency</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        urgency: e.target.value as 'Open' | 'Urgent',
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                  >
                    <option value="Open">Normal Hiring</option>
                    <option value="Urgent">Urgent Requirement</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Salary / Compensation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹25,000 – ₹35,000 / month"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Civic Centre, Jabalpur"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Required Skills & Qualifications
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tally Prime, GST Return Filing, B.Com / M.Com, 3+ yrs exp"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Job Description & Responsibilities *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide details on daily responsibilities, working hours, and candidate expectations…"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Application WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    placeholder="919826134567"
                    value={formData.contactWhatsApp}
                    onChange={(e) => setFormData({ ...formData, contactWhatsApp: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Application Email
                  </label>
                  <input
                    type="email"
                    placeholder="hr@enterprise.com"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-[#1540a8] hover:bg-[#07174a] text-white py-3 text-xs font-bold tracking-wide shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Publishing Vacancy…' : 'Publish Vacancy on Chamber Board'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
