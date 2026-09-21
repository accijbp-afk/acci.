'use client';

import React, { useState } from 'react';
import {
  Building2,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Mail,
  X,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { inquiriesService } from '@/services/appwrite/inquiries';
import { notificationService } from '@/services/notifications';

export default function FeatureBusinessSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const subject = form.businessName
        ? `Homepage Spotlight Inquiry: ${form.businessName}`
        : 'Homepage Spotlight & Business Feature Inquiry';

      const fullMessage = form.businessName
        ? `Business/Enterprise: ${form.businessName}\n\nMessage:\n${form.message}`
        : form.message;

      await inquiriesService.submitContact({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject,
        message: fullMessage,
      });

      // Notify Admin
      notificationService.notifyAdmin({
        event: 'INQUIRY_SUBMITTED',
        title: `Homepage Spotlight Request: ${form.businessName || form.name}`,
        subtitle: `A business has requested to be featured on the ACCI homepage.`,
        details: [
          { label: 'Sender Name', value: form.name },
          { label: 'Business Name', value: form.businessName || 'Not specified' },
          { label: 'Phone Number', value: form.phone || 'Not provided' },
          { label: 'Email Address', value: form.email },
          { label: 'Inquiry Subject', value: subject },
          { label: 'Message Content', value: form.message },
        ],
        actionUrl: '/admin',
      });

      // Send Acknowledgment to Sender
      if (form.email) {
        notificationService.notifyMember(form.email, {
          event: 'INQUIRY_ACKNOWLEDGED',
          title: `We have received your spotlight request, ${form.name}`,
          subtitle: `Thank you for your interest in featuring your enterprise on the ACCI Homepage Spotlight. Our team will review your details and contact you shortly.`,
          details: [
            { label: 'Business Name', value: form.businessName || 'N/A' },
            { label: 'Contact Phone', value: form.phone || 'N/A' },
            { label: 'Inquiry Type', value: 'Homepage Spotlight / Feature Request' },
            { label: 'Status', value: 'Forwarded to ACCI Executive Desk' },
          ],
          actionText: 'Visit ACCI Portal',
          actionUrl: '/',
        });
      }

      setSubmittedSuccess(true);
      setForm({
        name: '',
        email: '',
        phone: '',
        businessName: '',
        message: '',
      });
    } catch (err) {
      console.error('Error submitting feature inquiry:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="feature-your-business" className="py-10 sm:py-14 bg-[#faf8f5] border-b border-stone-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Horizontal Container Card */}
        <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#07174a] via-[#0b2168] to-[#040e30] p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-amber-400/20">
          {/* Subtle decorative watermark */}
          <div className="absolute top-0 right-0 p-6 opacity-5 font-serif text-8xl lg:text-9xl font-black text-white pointer-events-none select-none">
            ACCI
          </div>

          {/* Top Row: Title, Description & Action Button */}
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-300 backdrop-blur-xs mb-3">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Homepage Spotlight</span>
              </div>

              <h2 className="font-serif-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                Feature Your Business
              </h2>

              <p className="mt-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                Want to showcase your enterprise on the ACCI homepage? Get your business spotlighted in front of hundreds of business owners, industry leaders, and institutional buyers across Jabalpur and Mahakaushal.
              </p>
            </div>

            {/* Single Contact Us Button */}
            <div className="shrink-0 flex items-center">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#07174a] font-bold px-6 py-3.5 text-xs sm:text-sm shadow-lg hover:shadow-amber-400/25 transition-all cursor-pointer active:scale-95"
              >
                <Mail className="h-4 w-4" />
                <span>Contact Us</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Bottom Row: Features left to right */}
          <div className="relative z-10 mt-8 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xs hover:bg-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-start">
              <div className="flex items-center gap-3 mb-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-400 text-[#07174a]">
                  <TrendingUp className="h-4 w-4 font-bold" />
                </div>
                <h3 className="text-white font-semibold text-sm sm:text-base">
                  Prime Homepage Visibility
                </h3>
              </div>
              <p className="text-slate-300 text-xs sm:text-[13px] leading-relaxed">
                Featured placement on the ACCI homepage visited daily by business founders and community buyers.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xs hover:bg-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-start">
              <div className="flex items-center gap-3 mb-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-400 text-[#07174a]">
                  <ShieldCheck className="h-4 w-4 font-bold" />
                </div>
                <h3 className="text-white font-semibold text-sm sm:text-base">
                  Verified Chamber Credibility
                </h3>
              </div>
              <p className="text-slate-300 text-xs sm:text-[13px] leading-relaxed">
                Highlight your verified chamber membership badge, official enterprise profile, and brand portfolio.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xs hover:bg-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-start">
              <div className="flex items-center gap-3 mb-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-400 text-[#07174a]">
                  <Building2 className="h-4 w-4 font-bold" />
                </div>
                <h3 className="text-white font-semibold text-sm sm:text-base">
                  Direct Buyer Inquiries
                </h3>
              </div>
              <p className="text-slate-300 text-xs sm:text-[13px] leading-relaxed">
                Receive direct phone calls, WhatsApp messages, and email queries with zero intermediaries or commissions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Us Modal Form */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in"
          onClick={() => {
            setIsModalOpen(false);
            setSubmittedSuccess(false);
          }}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setSubmittedSuccess(false);
              }}
              className="absolute top-4 right-4 rounded-full p-2 text-slate-400 hover:bg-stone-100 hover:text-slate-700 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {submittedSuccess ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="font-serif-heading text-xl font-bold text-[#07174a]">
                  Inquiry Received
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                  Thank you for your interest in featuring your enterprise on the ACCI homepage. Our team will review your inquiry and get in touch with you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSubmittedSuccess(false);
                  }}
                  className="mt-6 inline-flex items-center rounded-xl bg-[#07174a] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#1540a8] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md mb-2">
                    <Sparkles className="h-3 w-3 text-amber-600" />
                    Homepage Spotlight
                  </div>
                  <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#07174a]">
                    Feature Your Business
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Submit your enterprise information to get featured on the ACCI homepage spotlight.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Rahul Agrawal"
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8] focus:ring-1 focus:ring-[#1540a8]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Mobile / WhatsApp <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 9876543210"
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8] focus:ring-1 focus:ring-[#1540a8]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="name@business.com"
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8] focus:ring-1 focus:ring-[#1540a8]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Business / Enterprise Name
                    </label>
                    <input
                      type="text"
                      value={form.businessName}
                      onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                      placeholder="e.g. Agrawal Steel & Traders"
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8] focus:ring-1 focus:ring-[#1540a8]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Message / What do you want to feature? <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Describe your products, manufacturing capabilities, showroom, or enterprise offerings…"
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8] focus:ring-1 focus:ring-[#1540a8]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#07174a] hover:bg-[#1540a8] text-white py-3 px-6 text-xs font-bold transition-all shadow cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <span>Send Inquiry</span>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
