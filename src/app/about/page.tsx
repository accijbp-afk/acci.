'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Award, Users, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="relative bg-[#07174a] py-16 text-white overflow-hidden border-b-4 border-amber-400">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Institutional Legacy & Purpose
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-5xl font-extrabold text-white mt-2">
            About Agrawal Chamber of Commerce & Industries
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            The apex institutional platform unifying, guiding, and expanding the commercial enterprise of the Agrawal community in Jabalpur and Mahakoshal for more than two decades.
          </p>
        </div>
      </section>

      {/* Main Narrative */}
      <section className="py-16 bg-[#faf8f5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-6 text-sm text-slate-700 leading-relaxed">
              <div className="border-l-4 border-amber-500 pl-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  Established in Jabalpur
                </span>
                <h2 className="font-serif-heading text-2xl font-bold text-[#07174a] mt-1">
                  A Legacy of Unity, Commerce & Collective Welfare
                </h2>
              </div>

              <p>
                The <strong>Agrawal Chamber of Commerce & Industries (ACCI), Jabalpur</strong> was established over twenty years ago by visionary community business leaders who recognized that commercial excellence flourishes best when backed by institutional solidarity, mutual trust, and transparent governance.
              </p>

              <p>
                From wholesale commodity trading in Krishi Upaj Mandi and the historic gold lanes of Bada Fuhara to modern food manufacturing plants in Richhai and high-precision hospitals in Wright Town — members of the Agrawal community have served as the vital economic bedrock of Jabalpur and the surrounding Mahakoshal division.
              </p>

              <p>
                ACCI transcends a traditional commercial listing; it functions as a comprehensive trade federation, dispute arbitration council, policy advocacy liaison with government ministries, and an incubator for first-generation youth and women entrepreneurs.
              </p>

              <div className="pt-4">
                <h3 className="font-serif-heading text-lg font-bold text-[#07174a] mb-3">
                  Our Constitutional Mandates
                </h3>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Inter-Enterprise Collaboration:</strong> Facilitating preferential bilateral trade and subcontracting within community member enterprises.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Policy Representation:</strong> Advocating before municipal, state, and central bodies on tax rationalization, industrial infrastructure, and ease of doing business.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Ethical Dispute Resolution:</strong> Providing amicable, respected commercial mediation so community enterprises avoid protracted legal litigation.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Philanthropic Endowment:</strong> Channeling chamber surpluses into community healthcare facilities, student scholarships, and skill apprenticeships.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Sidebar Summary Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border-2 border-amber-300/80 bg-white p-7 shadow-lg">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#07174a] text-amber-400 font-serif text-2xl font-bold">
                    A
                  </div>
                  <div>
                    <h3 className="font-serif-heading text-lg font-bold text-[#07174a]">
                      ACCI at a Glance
                    </h3>
                    <span className="text-xs text-slate-500">Jabalpur Headquarters</span>
                  </div>
                </div>

                <div className="mt-6 space-y-4 text-xs text-slate-600">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="font-medium text-slate-500">Jurisdiction</span>
                    <span className="font-bold text-slate-800">Jabalpur & Mahakoshal (M.P.)</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="font-medium text-slate-500">Active Member Units</span>
                    <span className="font-bold text-slate-800">500+ Verified Firms</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="font-medium text-slate-500">Industry Chapters</span>
                    <span className="font-bold text-slate-800">16 Industry Sectors</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="font-medium text-slate-500">Key Focus Areas</span>
                    <span className="font-bold text-slate-800">MSME, Trade, Taxation, Logistics</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="font-medium text-slate-500">Secretariat Location</span>
                    <span className="font-bold text-slate-800">Napier Town / Civic Centre</span>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href="/committee"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#1540a8] py-3 text-xs font-bold text-white hover:bg-[#07174a] transition-colors"
                  >
                    <span>Meet the Governing Committee</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
