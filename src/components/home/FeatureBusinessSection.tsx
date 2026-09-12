'use client';

import React, { useState } from 'react';
import { inquiriesService } from '@/services/appwrite/inquiries';
import { notificationService } from '@/services/notifications';
import { SEED_CATEGORIES } from '@/services/seedData';
import {
  Building2,
  Sparkles,
  CheckCircle2,
  Phone,
  Mail,
  User,
  Globe,
  Tag,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export default function FeatureBusinessSection() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    businessName: '',
    contactName: '',
    phone: '',
    email: '',
    category: 'Manufacturing',
    website: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formattedMessage = `
[HOMEPAGE SPOTLIGHT APPLICATION]
Enterprise Name: ${form.businessName}
Proprietor / Contact: ${form.contactName}
Phone / WhatsApp: ${form.phone}
Email: ${form.email}
Industry Category: ${form.category}
Website / Catalog: ${form.website || 'Not provided'}

Why feature this business:
${form.message}
      `.trim();

      // 1. Submit inquiry to chamber database
      await inquiriesService.submitContact({
        name: form.contactName,
        email: form.email,
        phone: form.phone,
        subject: `Homepage Spotlight Request: ${form.businessName}`,
        message: formattedMessage,
      });

      // 2. Dispatch alert to Secretariat admin
      notificationService.notifyAdmin({
        event: 'INQUIRY_SUBMITTED',
        title: `Homepage Spotlight Request: ${form.businessName}`,
        subtitle: `A member enterprise has applied to be featured on the ACCI Homepage Spotlight.`,
        details: [
          { label: 'Business Name', value: form.businessName },
          { label: 'Contact Person', value: form.contactName },
          { label: 'Phone / WhatsApp', value: form.phone },
          { label: 'Email', value: form.email },
          { label: 'Category', value: form.category },
        ],
        actionUrl: '/admin',
      });

      // 3. Dispatch confirmation to the applicant's email
      notificationService.notifyMember(form.email, {
        event: 'INQUIRY_ACKNOWLEDGED',
        title: `Spotlight Application Received: ${form.businessName}`,
        subtitle: `Thank you for applying to feature your business on the ACCI Jabalpur Homepage. Our Secretariat will review your credentials and contact you shortly.`,
        details: [
          { label: 'Enterprise Name', value: form.businessName },
          { label: 'Proprietor Name', value: form.contactName },
          { label: 'Registered Contact', value: form.phone },
          { label: 'Category', value: form.category },
          { label: 'Review Timeline', value: '24–48 Business Hours' },
        ],
        actionText: 'Explore Business Directory',
        actionUrl: '/directory',
      });

      setSuccess(true);
      setForm({
        businessName: '',
        contactName: '',
        phone: '',
        email: '',
        category: 'Manufacturing',
        website: '',
        message: '',
      });
    } catch (err) {
      console.error('Spotlight form submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="feature-your-business" className="py-20 bg-[#faf8f5] border-b border-stone-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-3xl border border-stone-200 bg-white shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Promotional / Info Column */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#07174a] via-[#0b2168] to-[#040e30] p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 font-serif text-9xl font-black text-white pointer-events-none">
                ACCI
              </div>

              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-300 backdrop-blur-xs mb-4">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>Homepage Spotlight</span>
                </div>

                <h2 className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  Feature Your Business
                </h2>

                <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Want to showcase your enterprise on the ACCI homepage? Get your products, manufacturing capabilities, and showroom spotlighted in front of hundreds of business owners, leaders, and institutional buyers in Jabalpur.
                </p>

                {/* Benefits List */}
                <div className="mt-8 space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-400 text-[#07174a]">
                      <TrendingUp className="h-4 w-4 font-bold" />
                    </div>
                    <div>
                      <strong className="block text-white font-semibold">Prime Homepage Visibility</strong>
                      <span className="text-slate-300 text-[11px]">
                        Get featured in our curated top enterprise spotlight carousel visited daily by community buyers.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-400 text-[#07174a]">
                      <ShieldCheck className="h-4 w-4 font-bold" />
                    </div>
                    <div>
                      <strong className="block text-white font-semibold">Verified Chamber Badge</strong>
                      <span className="text-slate-300 text-[11px]">
                        Establish community credibility with verified credentials, official logo, and trade profile.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-400 text-[#07174a]">
                      <Building2 className="h-4 w-4 font-bold" />
                    </div>
                    <div>
                      <strong className="block text-white font-semibold">Direct Buyer Inquiries</strong>
                      <span className="text-slate-300 text-[11px]">
                        Receive direct telephone, WhatsApp, and email queries with zero broker commissions.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-white/15 text-[11px] text-slate-400">
                <span>Secretariat Review: </span>
                <span className="text-amber-300 font-semibold">Applications are processed within 24–48 hours.</span>
              </div>
            </div>

            {/* Right Interactive Form Column */}
            <div className="lg:col-span-7 p-8 sm:p-12">
              <div className="mb-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#1540a8] block">
                  Application Form
                </span>
                <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#07174a] mt-0.5">
                  Submit Your Enterprise Profile
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Fill out the details below to request a featured spot on the ACCI Homepage.
                </p>
              </div>

              {success ? (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-8 text-center animate-in fade-in">
                  <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
                  <h4 className="font-serif-heading text-xl font-bold text-emerald-950">
                    Spotlight Request Received!
                  </h4>
                  <p className="text-xs text-emerald-800 mt-2 max-w-md mx-auto leading-relaxed">
                    Thank you for applying. A confirmation email has been dispatched to your email address. The ACCI Secretariat will review your enterprise details and contact you on WhatsApp / Phone shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="mt-6 rounded-lg bg-[#07174a] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#1540a8] transition-colors cursor-pointer"
                  >
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Enterprise / Firm Name *
                      </label>
                      <div className="relative">
                        <Building2 className="h-4 w-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={form.businessName}
                          onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                          placeholder="e.g. Agrawal Steel & Tube Mills"
                          className="w-full rounded-lg border border-slate-300 pl-9.5 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1540a8] transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Proprietor / Contact Name *
                      </label>
                      <div className="relative">
                        <User className="h-4 w-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={form.contactName}
                          onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                          placeholder="e.g. Sudhi Agrawal"
                          className="w-full rounded-lg border border-slate-300 pl-9.5 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1540a8] transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Mobile / WhatsApp Number *
                      </label>
                      <div className="relative">
                        <Phone className="h-4 w-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                        <input
                          type="tel"
                          required
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+91 9876543210"
                          className="w-full rounded-lg border border-slate-300 pl-9.5 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1540a8] transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Registered Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="contact@enterprise.com"
                          className="w-full rounded-lg border border-slate-300 pl-9.5 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1540a8] transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Industry / Category *
                      </label>
                      <div className="relative">
                        <Tag className="h-4 w-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                        <select
                          value={form.category}
                          onChange={(e) => setForm({ ...form, category: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 pl-9.5 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8] bg-white transition"
                        >
                          {SEED_CATEGORIES.map((cat) => (
                            <option key={cat.name} value={cat.name}>
                              {cat.name}
                            </option>
                          ))}
                          <option value="Other Industry">Other Commercial Industry</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Website / Catalog URL (Optional)
                      </label>
                      <div className="relative">
                        <Globe className="h-4 w-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                        <input
                          type="text"
                          value={form.website}
                          onChange={(e) => setForm({ ...form, website: e.target.value })}
                          placeholder="https://mybusiness.com or catalogue link"
                          className="w-full rounded-lg border border-slate-300 pl-9.5 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1540a8] transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Why Should Your Business Be Featured? *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Briefly describe your key products, manufacturing capabilities, years of establishment, or special promotional offers for Chamber members…"
                      className="w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1540a8] transition"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-400">
                      * All applications are delivered directly to the Chamber administrative office.
                    </span>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1540a8] hover:bg-[#07174a] text-white py-3 px-7 text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? (
                        <span>Submitting Application…</span>
                      ) : (
                        <>
                          <span>Submit Spotlight Application</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
