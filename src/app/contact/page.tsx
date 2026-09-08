'use client';

import React, { useState } from 'react';
import { inquiriesService } from '@/services/appwrite/inquiries';
import { notificationService } from '@/services/notifications';
import { Phone, Mail, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Collaborations & Strategic Partnerships',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await inquiriesService.submitContact(form);
      setSuccess(true);

      // Notify Secretariat Admin at accjbp@gmail.com
      notificationService.notifyAdmin({
        event: 'INQUIRY_SUBMITTED',
        title: `New Secretariat Inquiry: ${form.subject}`,
        subtitle: `A public communication has been submitted via the ACCI Contact Desk.`,
        details: [
          { label: 'Sender Name', value: form.name },
          { label: 'Email Address', value: form.email },
          { label: 'Phone Number', value: form.phone || 'Not provided' },
          { label: 'Subject Matter', value: form.subject },
          { label: 'Message Content', value: form.message },
        ],
        actionUrl: '/admin',
      });

      // Send Acknowledgment to Sender
      if (form.email) {
        notificationService.notifyMember(form.email, {
          event: 'INQUIRY_ACKNOWLEDGED',
          title: `We have received your message, ${form.name}`,
          subtitle: `Thank you for contacting the Agrawal Chamber of Commerce & Industries (ACCI) Jabalpur Secretariat.`,
          details: [
            { label: 'Subject Reference', value: form.subject },
            { label: 'Contact Phone', value: form.phone || 'N/A' },
            { label: 'Inquiry Status', value: 'Forwarded to Secretariat Officer' },
            { label: 'Response Window', value: 'Within 24–48 working hours' },
          ],
          actionText: 'Visit ACCI Portal',
          actionUrl: '/',
        });
      }

      setForm({
        name: '',
        email: '',
        phone: '',
        subject: 'Collaborations & Strategic Partnerships',
        message: '',
      });
    } catch {
      // Handled in service fallback
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#faf8f5] min-h-screen pb-20">
      {/* Header */}
      <section className="bg-[#07174a] text-white py-14 border-b-4 border-amber-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-1">
            Help Desk
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-5xl font-bold text-white">
            Contact ACCI
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl">
            Reach out to the Agrawal Chamber of Commerce &amp; Industries (ACCI) Jabalpur for membership verification, Events or commercial and non commercial partnerships.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="font-serif-heading text-xl font-bold text-[#07174a] mb-4">
                Contact us at
              </h2>
              <div className="space-y-4 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-800 text-sm font-semibold">Telephone &amp; WhatsApp</strong>
                    <a href="tel:+918319565363" className="text-blue-700 font-bold block">+91 8319565363</a>
                    <span className="text-[11px] text-slate-400">Monday to Saturday (10:00 AM – 06:30 PM)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-800 text-sm font-semibold">Email</strong>
                    <a href="mailto:accijbp@gmail.com" className="text-blue-700 font-medium block">
                      accijbp@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="font-serif-heading text-xl font-bold text-[#07174a]">
                Send us a message
              </h2>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                All submissions are delivered directly to the Chamber administrative office.
              </p>

              {success ? (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-8 text-center animate-in fade-in">
                  <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto mb-2" />
                  <h3 className="font-serif-heading text-lg font-bold text-emerald-900">
                    Message Received
                  </h3>
                  <p className="text-xs text-emerald-800 mt-1">
                    Thank you! The ACCI Secretariat will review your inquiry and get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 rounded-md bg-[#07174a] px-4 py-2 text-xs font-bold text-white"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Sudhi Agrawal"
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Mobile / WhatsApp Number *</label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 9876543210"
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="name@example.com"
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                      >
                        <option value="Collaborations & Strategic Partnerships">
                          Collaborations &amp; Strategic Partnerships
                        </option>
                        <option value="Inquiries on Upcoming Events & Programs">
                          Information on Upcoming Events &amp; Programs
                        </option>
                        <option value="General Queries & Public Information">
                          General Queries &amp; Public Information
                        </option>
                        <option value="Membership Verification & Affiliation">
                          Membership Verification &amp; Affiliation
                        </option>
                        <option value="Other Matters / Miscellaneous Inquiries">
                          Other Matters / Miscellaneous Inquiries
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Your Message *</label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Please elaborate on your inquiry or enterprise requirement…"
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center rounded-lg bg-[#1540a8] hover:bg-[#07174a] text-white py-3 px-8 text-xs font-bold transition-all shadow cursor-pointer disabled:opacity-50"
                  >
                    <span>{submitting ? 'Submitting…' : 'Submit'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
