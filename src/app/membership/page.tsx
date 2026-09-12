'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { membersService } from '@/services/appwrite/members';
import { notificationService } from '@/services/notifications';
import { SEED_CATEGORIES, SEED_INDUSTRIES } from '@/services/seedData';

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
            100% Free of Cost Community Portal
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-5xl font-bold text-white mt-1">
            Become a Member
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Register your enterprise with the Agrawal Chamber of Commerce &amp; Industries (ACCI) Jabalpur. Get verified, access commercial networks, and list your business for free.
          </p>
        </div>
      </section>

      {/* Application Form */}
      <section id="application-form" className="py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
            <div className="border-b border-slate-200 pb-4 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#1540a8]">
                Official Enrolment Form • 100% Free
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
