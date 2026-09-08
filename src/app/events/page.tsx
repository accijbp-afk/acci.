'use client';

import React, { useState, useEffect } from 'react';
import { eventsService } from '@/services/appwrite/events';
import { ChamberEvent } from '@/types';
import { Clock, MapPin } from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState<ChamberEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventsService.getEvents().then((evs) => {
      setEvents(evs);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-[#faf8f5] min-h-screen pb-20">
      {/* Header */}
      <section className="bg-[#07174a] text-white py-14 border-b-4 border-amber-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Chamber Assemblies &amp; Summits
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-5xl font-bold text-white mt-1">
            Events &amp; Community Conclaves
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl">
            Check upcoming events, business meets, and community conclaves organized by ACCI Jabalpur.
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
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center max-w-md mx-auto shadow-sm">
            <p className="text-xs text-slate-500">No events scheduled at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div
                    className="relative h-44 p-5 text-white flex flex-col justify-between overflow-hidden"
                    style={{ background: ev.bgColor || 'linear-gradient(135deg, #07174a, #1540a8)' }}
                  >
                    {ev.imageUrl && (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={ev.imageUrl}
                          alt={ev.title}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
                      </>
                    )}
                    <span className="relative z-10 self-start px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-white/20 backdrop-blur uppercase tracking-wider">
                      {ev.category}
                    </span>
                    <div className="relative z-10 flex items-baseline gap-2">
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
