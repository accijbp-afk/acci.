'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { membersService } from '@/services/appwrite/members';
import { SEED_CATEGORIES, SEED_INDUSTRIES } from '@/services/seedData';
import { CheckCircle2, ShieldCheck, ArrowRight, Building2, Award, Users, FileText, Check } from 'lucide-react';

export default function MembershipPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

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
            Chamber Affiliation & Privileges
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-5xl font-bold text-white mt-1">
            Membership & Business Enrolment
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Join the apex network of Agrawal enterprises in Jabalpur and Mahakoshal. Get verified, access inter-community B2B networks, and expand your commercial footprint.
          </p>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1540a8]">
              Membership Tiers
            </span>
            <h2 className="font-serif-heading text-2xl font-bold text-[#07174a] mt-1">
              Choose Your Chamber Affiliation
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              All Agrawal community business owners in Jabalpur can list their enterprise for FREE.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Standard Listing */}
            <div className="rounded-2xl border border-slate-200 bg-[#faf8f5] p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Community Member
                </div>
                <div className="font-serif-heading text-2xl font-bold text-[#07174a]">
                  Free Enrolment
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Essential verification for every small trader and shopkeeper.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Verified directory listing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Direct WhatsApp & phone lead buttons</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Post job vacancies for your shop/firm</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Access to Chamber circulars & alerts</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-200">
                <a
                  href="#application-form"
                  onClick={() => setForm({ ...form, plan: 'Free' })}
                  className="w-full inline-flex items-center justify-center rounded-lg border border-[#1540a8] py-2 text-xs font-bold text-[#1540a8] hover:bg-[#1540a8] hover:text-white transition-colors"
                >
                  Select Free Plan
                </a>
              </div>
            </div>

            {/* Pro Member */}
            <div className="rounded-2xl border-2 border-[#1540a8] bg-white p-6 shadow-md flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1540a8] text-white text-[10px] uppercase tracking-widest font-bold px-3 py-0.5 rounded-full">
                Most Popular
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#1540a8] mb-1">
                  Pro Enterprise
                </div>
                <div className="font-serif-heading text-2xl font-bold text-[#07174a]">
                  Annual Patronage
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  For established retailers, stockists, and professionals.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#1540a8] shrink-0" />
                    <span><strong>Everything in Free</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#1540a8] shrink-0" />
                    <span>Featured top placement in Directory</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#1540a8] shrink-0" />
                    <span>Pro Member Gold Crest verification badge</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#1540a8] shrink-0" />
                    <span>VIP Passes to Annual Business Conclave</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#1540a8] shrink-0" />
                    <span>GST & legal mediation desk assistance</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-200">
                <a
                  href="#application-form"
                  onClick={() => setForm({ ...form, plan: 'Pro' })}
                  className="w-full inline-flex items-center justify-center rounded-lg bg-[#1540a8] py-2 text-xs font-bold text-white hover:bg-[#07174a] transition-colors"
                >
                  Select Pro Tier
                </a>
              </div>
            </div>

            {/* Corporate / Patron */}
            <div className="rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50/60 to-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
                  Corporate Patron
                </div>
                <div className="font-serif-heading text-2xl font-bold text-[#07174a]">
                  Life Corporate Fellow
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  For large manufacturers, hospitals, and fleet operators.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-amber-600 shrink-0" />
                    <span><strong>All Pro Privileges Included</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>Permanent Council Advisory voting privilege</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>Exhibition stall space at Chamber Expos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>Government delegation representation seat</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-amber-200">
                <a
                  href="#application-form"
                  onClick={() => setForm({ ...form, plan: 'Premium' })}
                  className="w-full inline-flex items-center justify-center rounded-lg bg-amber-500 py-2 text-xs font-bold text-[#07174a] hover:bg-amber-400 transition-colors"
                >
                  Select Patron Tier
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="application-form" className="py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
            <div className="border-b border-slate-200 pb-4 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#1540a8]">
                Official Enrolment Form
              </span>
              <h2 className="font-serif-heading text-2xl font-bold text-[#07174a] mt-0.5">
                Register Your Business with ACCI
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Selected Plan: <strong className="text-amber-700">{form.plan} Plan</strong> • Takes less than 5 minutes.
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
                  <strong className="font-mono">{submittedId}</strong>. The ACCI Secretariat in Jabalpur will verify community details and approve your listing within 24–48 hours.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <Link
                    href="/directory"
                    className="inline-block rounded-lg bg-[#07174a] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#1540a8]"
                  >
                    View Directory
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
    </div>
  );
}
