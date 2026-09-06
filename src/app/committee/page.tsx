'use client';

import React from 'react';
import Link from 'next/link';
import { SEED_LEADERSHIP } from '@/services/seedData';
import { Mail, Phone, Shield, ArrowRight, Award } from 'lucide-react';

export default function CommitteePage() {
  const officeBearers = SEED_LEADERSHIP.filter((l) => l.category === 'Office Bearer');
  const executiveCommittee = SEED_LEADERSHIP.filter((l) => l.category === 'Executive Committee');

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-[#07174a] py-14 text-white border-b-4 border-amber-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Institutional Leadership
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-5xl font-bold text-white mt-2">
            Governing Council & Executive Committee
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl">
            Meet the esteemed office bearers, industrial captains, and professional advisors stewarding the Agrawal Chamber of Commerce & Industries (ACCI) Jabalpur.
          </p>
        </div>
      </section>

      {/* Office Bearers */}
      <section className="py-16 bg-[#faf8f5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="border-l-4 border-[#1540a8] pl-4 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1540a8]">
              Governance
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#07174a]">
              Principal Office Bearers
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Guiding chamber representations, policy formulation, and commercial initiatives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {officeBearers.map((ldr) => (
              <div
                key={ldr.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#07174a] font-serif text-2xl font-bold text-amber-400 shadow">
                      {ldr.name.split(' ').slice(-1)[0].charAt(0)}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {ldr.designation}
                      </span>
                      <h3 className="font-serif-heading text-base font-bold text-[#07174a] mt-1">
                        {ldr.name}
                      </h3>
                    </div>
                  </div>

                  <div className="text-xs font-semibold text-slate-700 mb-2">
                    🏢 {ldr.organization}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {ldr.bio}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  {ldr.phone && (
                    <a
                      href={`tel:${ldr.phone}`}
                      className="inline-flex items-center gap-1 font-semibold text-[#1540a8] hover:underline"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>{ldr.phone}</span>
                    </a>
                  )}
                  {ldr.email && (
                    <a
                      href={`mailto:${ldr.email}`}
                      className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-[#07174a]"
                    >
                      <Mail className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Committee & Chapter Leads */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="border-l-4 border-amber-500 pl-4 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Sectoral Stewardship
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#07174a]">
              Executive Council Members
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Sector heads overseeing healthcare, agriculture, trade disputes, and youth development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {executiveCommittee.map((ldr) => (
              <div
                key={ldr.id}
                className="rounded-xl border border-slate-200 bg-[#faf8f5] p-6 shadow-xs flex items-start gap-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-[#07174a] font-serif text-xl font-bold">
                  {ldr.name.charAt(0)}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {ldr.designation}
                  </span>
                  <h3 className="font-serif-heading text-base font-bold text-[#07174a] mt-1">
                    {ldr.name}
                  </h3>
                  <div className="text-xs text-slate-600 font-medium mt-0.5">
                    {ldr.organization}
                  </div>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {ldr.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
