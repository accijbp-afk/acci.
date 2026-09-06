'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { eventsService } from '@/services/appwrite/events';
import { ChamberEvent } from '@/types';
import { Calendar, MapPin, Clock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState<ChamberEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [rsvpModalEvent, setRsvpModalEvent] = useState<ChamberEvent | null>(null);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [delegateName, setDelegateName] = useState('');
  const [delegatePhone, setDelegatePhone] = useState('');
  const [delegateCompany, setDelegateCompany] = useState('');

  useEffect(() => {
    eventsService.getEvents().then((evs) => {
      setEvents(evs);
      setLoading(false);
    });
  }, []);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSuccess(true);
    setTimeout(() => {
      setRsvpModalEvent(null);
      setRsvpSuccess(false);
      setDelegateName('');
      setDelegatePhone('');
      setDelegateCompany('');
    }, 2000);
  };

  return (
    <div className="bg-[#faf8f5] min-h-screen pb-20">
      {/* Header */}
      <section className="bg-[#07174a] text-white py-14 border-b-4 border-amber-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Chamber Assemblies & Summits
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-5xl font-bold text-white mt-1">
            Events & Community Conclaves
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl">
            Join flagship industry dialogues, MSME taxation workshops, and cultural trade celebrations organized by the Agrawal Chamber of Commerce & Industries (ACCI) Jabalpur.
          </p>
        </div>
      </section>

      {/* Events List */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-10">
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#1540a8] border-r-transparent" />
            <p className="mt-3 text-xs text-slate-500">Loading events calendar…</p>
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center max-w-md mx-auto">
            <p className="text-xs text-slate-500">No events scheduled at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div
                    className="h-36 p-5 text-white flex flex-col justify-between"
                    style={{ background: ev.bgColor || 'linear-gradient(135deg, #07174a, #1540a8)' }}
                  >
                    <span className="self-start px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-white/20 backdrop-blur uppercase tracking-wider">
                      {ev.category}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif-heading text-3xl font-extrabold text-amber-300">
                        {ev.date ? new Date(ev.date).getDate() : '18'}
                      </span>
                      <span className="text-xs font-semibold text-slate-200 uppercase">
                        {ev.date
                          ? new Date(ev.date).toLocaleString('default', { month: 'short', year: 'numeric' })
                          : 'Oct 2026'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-serif-heading text-lg font-bold text-[#07174a]">
                      {ev.title}
                    </h3>
                    <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{ev.time}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{ev.venue}</span>
                      </div>
                    </div>

                    <p className="mt-4 text-xs text-slate-600 leading-relaxed">
                      {ev.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 mt-4">
                  <button
                    onClick={() => setRsvpModalEvent(ev)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#1540a8] py-2.5 px-4 text-xs font-bold text-white hover:bg-[#07174a] transition-colors cursor-pointer"
                  >
                    <span>Request Delegate Pass</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delegate Pass Modal */}
      {rsvpModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <button
              onClick={() => setRsvpModalEvent(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100"
            >
              ✕
            </button>

            <h3 className="font-serif-heading text-lg font-bold text-[#07174a]">
              Request Delegate Pass
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
              Event: <strong className="text-slate-800">{rsvpModalEvent.title}</strong>
            </p>

            {rsvpSuccess ? (
              <div className="rounded-lg bg-emerald-50 p-4 text-emerald-800 text-xs font-semibold text-center my-6">
                ✅ Delegate pass confirmed! The secretariat will WhatsApp your pass.
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Delegate Name</label>
                  <input
                    type="text"
                    required
                    value={delegateName}
                    onChange={(e) => setDelegateName(e.target.value)}
                    placeholder="e.g. Ramesh Agrawal"
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Enterprise / Firm Name</label>
                  <input
                    type="text"
                    required
                    value={delegateCompany}
                    onChange={(e) => setDelegateCompany(e.target.value)}
                    placeholder="e.g. Agrawal Jewellers Pvt. Ltd."
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile / WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    value={delegatePhone}
                    onChange={(e) => setDelegatePhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#1540a8] py-2.5 text-xs font-bold text-white hover:bg-[#07174a] transition-colors"
                >
                  Confirm Delegate Registration
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
