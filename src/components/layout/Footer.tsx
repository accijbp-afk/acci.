'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/common/LanguageContext';
import { Phone, Mail, MapPin, Shield, ExternalLink, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#040d2b] text-slate-300 border-t-2 border-amber-400/30">
      {/* Top Banner with Quick Actions */}
      <div className="bg-[#07174a] border-b border-white/10 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-1">
              Agrawal Chamber of Commerce & Industries • Jabalpur
            </div>
            <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-white">
              Are you an Agrawal business owner in Jabalpur?
            </h3>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Get verified, access B2B commercial networks, and list your enterprise on Central India&apos;s largest community commerce portal.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/membership"
              className="inline-flex items-center gap-2 rounded-md bg-amber-400 px-5 py-2.5 text-xs sm:text-sm font-bold text-[#07174a] hover:bg-amber-300 transition-all shadow-md"
            >
              <span>Apply for Membership</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-white/10 transition-all"
            >
              <span>Contact Secretariat</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Identity Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-400/50 bg-white p-1 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/acci_logo.jpg"
                  alt="ACCI Logo"
                  className="h-full w-full rounded-lg object-contain"
                />
              </div>
              <div>
                <span className="font-serif-heading font-bold text-lg text-white block">
                  AGRAWAL COMMITTEE
                </span>
                <span className="text-xs text-amber-300/80 tracking-wider uppercase font-medium">
                  Chamber of Commerce & Industries
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              The apex institution fostering business collaboration, ethical enterprise, and collective welfare for the Agrawal community in Jabalpur and Mahakoshal for over two decades.
            </p>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>ACCI Secretariat, Napier Town & Civic Centre, Jabalpur, Madhya Pradesh – 482001</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-amber-400 shrink-0" />
                <a href="tel:+918319565363" className="hover:text-amber-300">+91 8319565363</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                <a href="mailto:accijabalpur@gmail.com" className="hover:text-amber-300">accijabalpur@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Directory Column */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-amber-400/20 pb-2">
              Industry Directory
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/directory?category=Manufacturing" className="hover:text-amber-300 transition-colors">
                  Manufacturing & FMCG
                </Link>
              </li>
              <li>
                <Link href="/directory?category=Wholesale" className="hover:text-amber-300 transition-colors">
                  Wholesale & Commodities
                </Link>
              </li>
              <li>
                <Link href="/directory?category=Retail" className="hover:text-amber-300 transition-colors">
                  Retail & Jewellers
                </Link>
              </li>
              <li>
                <Link href="/directory?category=Professional" className="hover:text-amber-300 transition-colors">
                  CA, Audit & Legal Counsel
                </Link>
              </li>
              <li>
                <Link href="/directory?category=Distribution" className="hover:text-amber-300 transition-colors">
                  Logistics & Warehousing
                </Link>
              </li>
              <li>
                <Link href="/directory?category=Service+Provider" className="hover:text-amber-300 transition-colors">
                  Hospitals & Healthcare
                </Link>
              </li>
            </ul>
          </div>

          {/* Chamber Column */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-amber-400/20 pb-2">
              The Chamber
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-amber-300 transition-colors">
                  About ACCI Legacy
                </Link>
              </li>
              <li>
                <Link href="/committee" className="hover:text-amber-300 transition-colors">
                  Executive Committee
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-amber-300 transition-colors">
                  Conclaves & Seminars
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-amber-300 transition-colors">
                  Trade Advisories & Circulars
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-amber-300 transition-colors">
                  Employment Board
                </Link>
              </li>
              <li>
                <Link href="/membership" className="hover:text-amber-300 transition-colors">
                  Membership Benefits & Tiers
                </Link>
              </li>
            </ul>
          </div>

          {/* Member Portal & Security */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-amber-400/20 pb-2">
              Members & Portal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/login" className="hover:text-amber-300 transition-colors">
                  Member Login
                </Link>
              </li>
              <li>
                <Link href="/membership" className="hover:text-amber-300 transition-colors">
                  New Business Listing
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-amber-300 transition-colors">
                  Listing Management
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-300 transition-colors">
                  Chamber Admin Access
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-amber-300 transition-colors">
                  Constitution & Bylaws
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-amber-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-[#020719] px-4 py-5 text-xs text-slate-400">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-3">
          <div>
            © {new Date().getFullYear()} Agrawal Chamber of Commerce & Industries (ACCI), Jabalpur. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <span className="text-amber-400/90 font-medium">
              Powered by Appwrite Backend
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
