'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { authService } from '@/services/appwrite/auth';
import { membersService } from '@/services/appwrite/members';
import { notificationService } from '@/services/notifications';
import { SEED_CATEGORIES, SEED_INDUSTRIES } from '@/services/seedData';
import { UserProfile } from '@/types';
import { ShieldCheck, UserPlus, LogIn, ArrowRight, CheckCircle2, Building2 } from 'lucide-react';

export default function MembershipPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [form, setForm] = useState({
    businessName: '',
    legalName: '',
    ownerName: '',
    category: 'Manufacturing' as const,
    industry: 'Food Processing & FMCG',
    description: '',
    detailed: '',
    tagline: '',
    phone: '',
    whatsapp: '',
    email: '',
    website: '',
    address: '',
    city: 'Jabalpur',
    pinCode: '482001',
    timing: 'Mon–Sat: 10:00 AM – 07:30 PM',
    gst: '',
    estYear: '2015',
    employees: '5',
    services: '',
    products: '',
    plan: 'Free' as 'Free' | 'Pro' | 'Premium',
    consent: false,
  });

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((u) => {
        if (u) {
          setCurrentUser(u);
          setForm((prev) => ({
            ...prev,
            ownerName: prev.ownerName || u.name,
            email: prev.email || u.email,
            phone: prev.phone || u.phone || '',
            city: prev.city || u.city || 'Jabalpur',
          }));
        }
        setCheckingAuth(false);
      })
      .catch(() => {
        setCheckingAuth(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) {
      setErrorMsg('Please confirm the consent declaration before submitting.');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);

    try {
      const res = await membersService.createMember({
        userId: currentUser?.userId,
        businessName: form.businessName,
        legalName: form.legalName,
        ownerName: form.ownerName,
        category: form.category,
        industry: form.industry,
        description: form.description,
        detailed: form.detailed,
        tagline: form.tagline,
        phone: form.phone,
        whatsapp: form.whatsapp || form.phone,
        email: form.email,
        website: form.website,
        address: form.address,
        city: form.city,
        pinCode: form.pinCode,
        timing: form.timing,
        gst: form.gst,
        estYear: form.estYear,
        employees: form.employees,
        services: form.services,
        products: form.products,
        plan: form.plan,
        featured: false,
        rating: 0,
        reviewCount: 0,
      });

      setSubmittedId(res.id);

      // Notify Admin at accijbp@gmail.com
      notificationService.notifyAdmin({
        event: 'MEMBERSHIP_APPLICATION',
        title: `New Business Membership Application: ${form.businessName}`,
        subtitle: `A new enterprise has applied for inclusion in the ACCI Chamber Directory.`,
        details: [
          { label: 'Business Name', value: form.businessName },
          { label: 'Proprietor / Owner', value: form.ownerName },
          { label: 'Category & Sector', value: `${form.category} (${form.industry})` },
          { label: 'Contact Phone', value: form.phone },
          { label: 'Business Email', value: form.email || 'Not provided' },
          { label: 'City & Pincode', value: `${form.city}, ${form.pinCode}` },
          { label: 'GSTIN Number', value: form.gst || 'None / Unregistered' },
          { label: 'Membership Plan', value: form.plan },
          { label: 'Application ID', value: res.id },
        ],
        actionUrl: '/admin',
      });

      // Notify Applicant if email was provided
      if (form.email) {
        notificationService.notifyMember(form.email, {
          event: 'APPLICATION_RECEIVED',
          title: `Application Received: ${form.businessName}`,
          subtitle: `Thank you for applying for ACCI Chamber Directory listing. Your application has been received and our team will review it.`,
          details: [
            { label: 'Enterprise Name', value: form.businessName },
            { label: 'Proprietor', value: form.ownerName },
            { label: 'Classification', value: form.category },
            { label: 'Application ID', value: res.id },
            { label: 'Next Step', value: 'Our team will review and approve your listing within 24–48 hours' },
          ],
          actionText: 'Explore Chamber Directory',
          actionUrl: '/directory',
        });
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Submission failed. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#faf8f5] min-h-screen pb-20">
      {/* Header */}
      <section className="bg-[#07174a] text-white py-14 border-b-4 border-amber-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Exclusive ACCI Member Service
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-5xl font-bold text-white mt-1">
            List Your Business Enterprise
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Register your enterprise in the official Agrawal Chamber of Commerce &amp; Industries (ACCI) Directory. Connect with verified traders, access commercial contracts, and grow across Jabalpur and Mahakaushal.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      {checkingAuth ? (
        <section className="py-20">
          <div className="mx-auto max-w-md px-4 text-center">
            <div className="inline-block h-9 w-9 animate-spin rounded-full border-4 border-[#1540a8] border-r-transparent mb-4" />
            <p className="text-sm font-semibold text-slate-700">Verifying ACCI member authorization…</p>
            <p className="text-xs text-slate-400 mt-1">Checking member credentials and permissions</p>
          </div>
        </section>
      ) : !currentUser ? (
        <section className="py-14">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <div className="rounded-3xl border border-amber-400/30 bg-white shadow-2xl overflow-hidden">
              {/* Top Navy Banner */}
              <div className="bg-gradient-to-r from-[#07174a] to-[#1540a8] px-6 sm:px-8 py-8 text-white relative">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 border border-amber-400/40 px-3 py-1 text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-3">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                  <span>Member Verification Required</span>
                </div>
                <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-white leading-tight">
                  Become a Member to List Your Business
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed">
                  Directory listings are exclusively reserved for registered members of the Agrawal Chamber of Commerce &amp; Industries.
                </p>
              </div>

              {/* Explanatory Body & Steps */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-[#07174a] font-bold text-xs mb-3">
                      1
                    </div>
                    <h4 className="font-bold text-[#07174a] text-xs">Become a Member</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                      Create your free personal member account in under a minute.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-[#1540a8] font-bold text-xs mb-3">
                      2
                    </div>
                    <h4 className="font-bold text-[#07174a] text-xs">Log In to Portal</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                      Authenticate securely with your email and member password.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs mb-3">
                      3
                    </div>
                    <h4 className="font-bold text-[#07174a] text-xs">List &amp; Verify</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                      Register company details to get verified in the Jabalpur directory.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/register?redirect=/membership"
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 px-5 py-3.5 text-xs font-bold text-[#07174a] shadow-md transition-all hover:-translate-y-0.5"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Become a Member (Create Free Account)</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/login?redirect=/membership"
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 hover:bg-slate-50 px-5 py-3.5 text-xs font-semibold text-slate-700 transition-all"
                  >
                    <LogIn className="h-4 w-4 text-[#1540a8]" />
                    <span>Already a Member? Log In</span>
                  </Link>
                </div>

                <div className="text-center pt-2 border-t border-slate-100">
                  <Link
                    href="/directory"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1540a8] hover:text-[#07174a]"
                  >
                    <Building2 className="h-3.5 w-3.5" />
                    <span>Browse registered businesses in directory first</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* Application Form for Logged-in Members */
        <section id="application-form" className="py-14">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
              {/* Member Confirmation Banner */}
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-950">
                      Logged in as: {currentUser.name}
                    </div>
                    <div className="text-[11px] text-emerald-700">
                      {currentUser.email} • Verified ACCI Member Account
                    </div>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline self-start sm:self-auto"
                >
                  Go to Dashboard →
                </Link>
              </div>

              <div className="border-b border-slate-200 pb-4 mb-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#1540a8]">
                  Official Enrolment Form • Free Member Benefit
                </span>
                <h2 className="font-serif-heading text-2xl font-bold text-[#07174a] mt-0.5">
                  Register Your Business with ACCI
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Completely free of cost for all Agrawal community business owners • Takes less than 5 minutes.
                </p>
              </div>

              {submittedId ? (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-8 text-center animate-in fade-in">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-2xl mb-4">
                    ✓
                  </div>
                  <h3 className="font-serif-heading text-xl font-bold text-emerald-900">
                    Enrolment Application Submitted!
                  </h3>
                  <p className="text-xs text-emerald-800 mt-2 max-w-md mx-auto leading-relaxed">
                    Your enterprise details have been recorded under Application Reference ID{' '}
                    <strong className="font-mono">{submittedId}</strong>. Our team in Jabalpur will verify details and approve your listing within 24–48 hours.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Link
                      href="/dashboard"
                      className="inline-block rounded-lg bg-[#07174a] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#1540a8]"
                    >
                      View in My Dashboard
                    </Link>
                    <Link
                      href="/directory"
                      className="inline-block rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Browse Directory
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 text-xs">
                {errorMsg && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-700 font-semibold">
                    {errorMsg}
                  </div>
                )}

                {/* Section 1: Identity */}
                <div>
                  <h4 className="font-bold text-[#07174a] uppercase tracking-wider mb-3 text-[11px] pb-1 border-b border-slate-100">
                    1. Enterprise Identity
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Business / Shop Trade Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.businessName}
                        onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                        placeholder="e.g. Agrawal Jewellers"
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Founder / Proprietor Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.ownerName}
                        onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                        placeholder="e.g. Ramesh Agrawal"
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Legal Registered Entity Name (if applicable)
                      </label>
                      <input
                        type="text"
                        value={form.legalName}
                        onChange={(e) => setForm({ ...form, legalName: e.target.value })}
                        placeholder="e.g. Agrawal Jewellers LLP / Pvt. Ltd."
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Year of Establishment
                      </label>
                      <input
                        type="text"
                        value={form.estYear}
                        onChange={(e) => setForm({ ...form, estYear: e.target.value })}
                        placeholder="e.g. 2005"
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Classification */}
                <div>
                  <h4 className="font-bold text-[#07174a] uppercase tracking-wider mb-3 text-[11px] pb-1 border-b border-slate-100">
                    2. Sector & Industry Classification
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Category *
                      </label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                      >
                        {SEED_CATEGORIES.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Industry *
                      </label>
                      <select
                        value={form.industry}
                        onChange={(e) => setForm({ ...form, industry: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                      >
                        {SEED_INDUSTRIES.map((ind) => (
                          <option key={ind.id} value={ind.name}>
                            {ind.icon} {ind.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block font-semibold text-slate-700 mb-1">
                      Brief Enterprise Profile (max 100 words) *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Describe your primary products, manufacturing capacity, or commercial service offering in brief…"
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                    />
                  </div>
                </div>

                {/* Section 3: Contact & Address */}
                <div>
                  <h4 className="font-bold text-[#07174a] uppercase tracking-wider mb-3 text-[11px] pb-1 border-b border-slate-100">
                    3. Location & Direct Contacts
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Mobile Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 9876543210"
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        WhatsApp Number for Buyer Leads
                      </label>
                      <input
                        type="tel"
                        value={form.whatsapp}
                        onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                        placeholder="9876543210"
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Commercial Email Address
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="business@example.com"
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Website or Catalogue URL
                      </label>
                      <input
                        type="text"
                        value={form.website}
                        onChange={(e) => setForm({ ...form, website: e.target.value })}
                        placeholder="https://…"
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block font-semibold text-slate-700 mb-1">
                      Shop / Factory / Office Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="Shop No., Road, Industrial Area / Market"
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">City / Area</label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        placeholder="Jabalpur"
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">PIN Code</label>
                      <input
                        type="text"
                        value={form.pinCode}
                        onChange={(e) => setForm({ ...form, pinCode: e.target.value })}
                        placeholder="482001"
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block font-semibold text-slate-700 mb-1">GST Number</label>
                      <input
                        type="text"
                        value={form.gst}
                        onChange={(e) => setForm({ ...form, gst: e.target.value.toUpperCase() })}
                        placeholder="23AAAAA0000A1Z5"
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:border-[#1540a8]"
                      />
                    </div>
                  </div>
                </div>

                {/* Consent Declaration */}
                <div className="rounded-xl bg-amber-50 p-4 border border-amber-200/80 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="consent-check"
                    checked={form.consent}
                    onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#1540a8] focus:ring-amber-400 cursor-pointer"
                  />
                  <label htmlFor="consent-check" className="text-xs text-amber-950 leading-relaxed cursor-pointer">
                    I solemnly declare that the information provided above is accurate, that the applicant belongs to the Agrawal community, and I consent to ACCI publishing this commercial profile on the Chamber directory.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-[#1540a8] hover:bg-[#07174a] text-white py-3.5 text-sm font-bold tracking-wide shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Submitting Application…' : 'Submit Business Enrolment Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
      )}
    </div>
  );
}
