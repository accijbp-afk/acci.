'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { eventsService } from '@/services/appwrite/events';
import { ChamberEvent } from '@/types';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';

function parseEventDate(dateStr: string) {
  if (!dateStr) return { day: '', monthYear: '' };
  try {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [y, m, d] = dateStr.split('-');
      const dObj = new Date(Number(y), Number(m) - 1, Number(d));
      return {
        day: String(Number(d)),
        monthYear: dObj.toLocaleString('default', { month: 'short', year: 'numeric' }),
      };
    }
    const dObj = new Date(dateStr);
    if (!isNaN(dObj.getTime())) {
      return {
        day: String(dObj.getDate()),
        monthYear: dObj.toLocaleString('default', { month: 'short', year: 'numeric' }),
      };
    }
  } catch {
    // fallback
  }
  return { day: dateStr, monthYear: '' };
}

export default function UpcomingEventsSection() {
  const [events, setEvents] = useState<ChamberEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventsService.getEvents().then((evs) => {
      setEvents(evs || []);
      setLoading(false);
    });
  }, []);

  return (
    <section id="upcoming-events" className="py-16 sm:py-20 bg-[#faf8f5] border-b border-stone-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header with Title & Link */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-900 mb-2">
              <Calendar className="h-3.5 w-3.5 text-amber-600" />
              <span>Chamber Assemblies &amp; Summits</span>
            </div>
            <h2 className="font-serif-heading text-2xl sm:text-4xl font-extrabold text-[#07174a]">
              Upcoming Events
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 max-w-2xl">
              Join upcoming trade conclaves, business networking assemblies, and industry meets organized by ACCI Jabalpur.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 rounded-xl bg-[#07174a] hover:bg-[#1540a8] text-white px-5 py-2.5 text-xs font-bold transition-all shadow-sm hover:shadow self-start sm:self-auto cursor-pointer shrink-0"
          >
            <span>View All Events</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#1540a8] border-r-transparent" />
            <p className="mt-3 text-xs text-slate-500 font-medium">Loading upcoming events calendar…</p>
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-10 sm:p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 mb-3">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="font-serif-heading text-base sm:text-lg font-bold text-[#07174a]">
              No Upcoming Events Scheduled
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
              New summits and member conclaves are announced periodically. Check back soon or visit our full events calendar.
            </p>
            <div className="mt-5">
              <Link
                href="/events"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span>Check Events Desk</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {events.slice(0, 3).map((ev, idx) => {
              const { day, monthYear } = parseEventDate(ev.date);
              return (
                <div
                  key={ev.$id || ev.id || `event-${idx}`}
                  className="group rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-400/60 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Event Banner */}
                    <div
                      className="relative h-48 p-5 text-white flex flex-col justify-between overflow-hidden"
                      style={{ background: ev.bgColor || 'linear-gradient(135deg, #07174a, #1540a8)' }}
                    >
                      {ev.imageUrl && (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={ev.imageUrl}
                            alt={ev.title}
                            className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
                        </>
                      )}
                      <span className="relative z-10 self-start px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-white/20 backdrop-blur-xs uppercase tracking-wider border border-white/20">
                        {ev.category}
                      </span>
                      <div className="relative z-10 flex items-baseline gap-2">
                        <span className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-amber-300 drop-shadow-xs">
                          {day || '📅'}
                        </span>
                        <span className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
                          {monthYear || ev.date}
                        </span>
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="p-6">
                      <h3 className="font-serif-heading text-lg font-bold text-[#07174a] group-hover:text-[#1540a8] transition-colors line-clamp-2">
                        {ev.title}
                      </h3>

                      <div className="mt-3.5 space-y-2 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                          <span className="font-medium text-slate-700">{ev.time}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1 text-slate-600">{ev.venue}</span>
                        </div>
                      </div>

                      <p className="mt-4 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {ev.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer / Action */}
                  <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href="/events"
                      className="text-xs font-semibold text-slate-500 hover:text-[#07174a] transition-colors"
                    >
                      View Details
                    </Link>
                    {ev.registrationUrl ? (
                      <a
                        href={ev.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#07174a] hover:bg-[#1540a8] text-white px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer shadow-xs"
                      >
                        <span>Register Now</span>
                        <ArrowRight className="h-3 w-3" />
                      </a>
                    ) : (
                      <Link
                        href="/events"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-[#07174a] px-3.5 py-1.5 text-xs font-bold transition-colors shadow-xs"
                      >
                        <span>Attend &amp; Details</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA to see all events if there are more than 3 events */}
        {!loading && events.length > 3 && (
          <div className="mt-10 text-center">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-xl border border-[#07174a]/20 bg-white hover:bg-stone-50 text-[#07174a] px-6 py-3 text-xs font-bold transition-all shadow-xs"
            >
              <span>Explore All {events.length} Scheduled Events &amp; Conclaves</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#1540a8]" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
