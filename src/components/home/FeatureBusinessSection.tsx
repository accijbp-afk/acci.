'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building2,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export default function FeatureBusinessSection() {
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
                  Want to showcase your enterprise on the ACCI homepage? Get your products, manufacturing capabilities, and showroom spotlighted in front of hundreds of business owners, industry leaders, and institutional buyers across Jabalpur and Mahakaushal.
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
                        Featured placement on the ACCI homepage visited daily by business founders and community buyers.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-400 text-[#07174a]">
                      <ShieldCheck className="h-4 w-4 font-bold" />
                    </div>
                    <div>
                      <strong className="block text-white font-semibold">Verified Chamber Credibility</strong>
                      <span className="text-slate-300 text-[11px]">
                        Highlight your verified chamber membership badge, official enterprise profile, and brand portfolio.
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
                        Receive direct phone calls, WhatsApp messages, and email queries with zero intermediaries or commissions.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-white/15 text-[11px] text-slate-400">
                <span>Secretariat Coordination: </span>
                <span className="text-amber-300 font-semibold">Spotlight listings are coordinated directly with the Chamber desk.</span>
              </div>
            </div>

            {/* Right Contact Us Column */}
            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-white">
              <div>
                <div className="mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#1540a8] block">
                    Get Featured
                  </span>
                  <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#07174a] mt-1">
                    Contact Us
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    To feature your enterprise, showroom, or industrial unit on the ACCI homepage spotlight, get in touch directly with our Secretariat team via Phone, WhatsApp, or Email.
                  </p>
                </div>

                {/* Contact Cards Grid */}
                <div className="space-y-4">
                  {/* Phone & WhatsApp Card */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 hover:border-amber-400/60 hover:bg-amber-50/20 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#07174a] text-amber-400 shadow-xs">
                          <Phone className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                            Direct Telephone &amp; WhatsApp
                          </span>
                          <a
                            href="tel:+918319565363"
                            className="text-lg font-bold text-[#07174a] hover:text-[#1540a8] transition-colors"
                          >
                            +91 8319565363
                          </a>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                            <Clock className="h-3 w-3 text-slate-400" />
                            <span>Mon – Sat: 10:00 AM – 06:30 PM IST</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href="tel:+918319565363"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#07174a] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#1540a8] transition-colors cursor-pointer shadow-xs"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          <span>Call Now</span>
                        </a>
                        <a
                          href="https://wa.me/918319565363?text=Hello%20ACCI,%20I%20would%20like%20to%20feature%20my%20business%20on%20the%20ACCI%20homepage."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Email Card */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 hover:border-amber-400/60 hover:bg-amber-50/20 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#07174a] text-amber-400 shadow-xs">
                          <Mail className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                            Secretariat Official Email
                          </span>
                          <a
                            href="mailto:accijbp@gmail.com?subject=Inquiry%20to%20Feature%20Business%20on%20ACCI%20Homepage"
                            className="text-base sm:text-lg font-bold text-[#07174a] hover:text-[#1540a8] transition-colors break-all"
                          >
                            accijbp@gmail.com
                          </a>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Send enterprise brochure, business profile, or showcase proposal.
                          </p>
                        </div>
                      </div>

                      <a
                        href="mailto:accijbp@gmail.com?subject=Inquiry%20to%20Feature%20Business%20on%20ACCI%20Homepage"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer self-start sm:self-center"
                      >
                        <Mail className="h-3.5 w-3.5 text-[#1540a8]" />
                        <span>Send Email</span>
                      </a>
                    </div>
                  </div>

                  {/* Chamber Secretariat Office */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#07174a] text-amber-400 shadow-xs">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                          Chamber Secretariat
                        </span>
                        <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-0.5">
                          Agrawal Chamber of Commerce &amp; Industries (ACCI)
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Jabalpur, Madhya Pradesh – 482001, India
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Help / Full Contact Page Link */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs text-slate-500">
                  Looking for general inquiries, event information, or membership assistance?
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1540a8] hover:text-[#07174a] transition-colors"
                >
                  <span>Visit Full Contact Page</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
