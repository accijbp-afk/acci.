'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/common/LanguageContext';
import { membersService } from '@/services/appwrite/members';
import { eventsService } from '@/services/appwrite/events';
import { jobsService } from '@/services/appwrite/jobs';
import { newsService } from '@/services/appwrite/news';
import { SEED_CATEGORIES, SEED_INDUSTRIES, SEED_IMPACT_STORIES, SEED_GALLERY, GalleryAlbum } from '@/services/seedData';
import { MemberBusiness, ChamberEvent, JobListing, ChamberNews } from '@/types';
import {
  Search,
  CheckCircle2,
  Building2,
  Phone,
  MessageSquare,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Shield,
  Briefcase,
  Award,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Star,
  FileText,
  Camera,
  Layers,
  ChevronDown,
  X,
  Radio,
  Flame,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { t, lang } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [featuredMembers, setFeaturedMembers] = useState<MemberBusiness[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<ChamberEvent[]>([]);
  const [recentJobs, setRecentJobs] = useState<JobListing[]>([]);
  const [chamberNews, setChamberNews] = useState<ChamberNews[]>([]);
  const [activeModalMember, setActiveModalMember] = useState<MemberBusiness | null>(null);
  const [activeGalleryItem, setActiveGalleryItem] = useState<GalleryAlbum | null>(null);

  useEffect(() => {
    membersService
      .getMembers({ featuredOnly: true, limit: 6 })
      .then((res) => setFeaturedMembers(res.members));
    eventsService.getEvents().then((evs) => setUpcomingEvents(evs.slice(0, 3)));
    jobsService.getJobs({ activeOnly: true }).then((jbs) => setRecentJobs(jbs.slice(0, 3)));
    newsService.getNews().then((news) => setChamberNews(news.slice(0, 3)));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('search', searchTerm.trim());
    if (selectedIndustry) params.set('industry', selectedIndustry);
    router.push(`/directory?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#faf8f5]">
      {/* ── 0. OFFICIAL CHAMBER GAZETTE TICKER TAPE ───────────────────── */}
      <div className="bg-[#051136] border-b border-amber-400/30 text-xs text-white py-2 px-4">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600/90 px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              Chamber Gazette
            </span>
            <div className="text-slate-200 text-xs font-medium truncate">
              Delegation meets MP Industries Minister for Jabalpur Logistics Hub • Central India Business Conclave scheduled for Oct 18 • GST Advisory published
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] text-slate-300 shrink-0">
            <span>Official Portal • Jabalpur Secretariat</span>
            <span className="text-amber-400 font-semibold">T: +91 8319565363</span>
          </div>
        </div>
      </div>

      {/* ── 1. TWO-COLUMN CORPORATE HERO SECTION ──────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#07174a] via-[#091e5e] to-[#040e30] text-white pt-10 pb-16 lg:pt-14 lg:pb-20 border-b border-amber-500/20">
        {/* Subtle geometric jali filigree background overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Column: Official Chamber Identity & Search */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Heraldic Affiliation Seal Eyebrow */}
              <div className="inline-flex items-center gap-3 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1.5 text-xs font-semibold tracking-wider text-amber-300 uppercase backdrop-blur-sm mb-6 shadow-sm">
                <div className="relative h-6 w-6 rounded-md overflow-hidden shrink-0 border border-amber-400 bg-white p-0.5">
                  <Image
                    src="/images/acci_logo.jpg"
                    alt="ACCI Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span>Apex Agrawal Trade Body • Estd. 2002 • Jabalpur</span>
              </div>

              {/* Dignified Corporate Headline */}
              <h1 className="font-serif-heading text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Catalyzing Central India&apos;s{' '}
                <span className="text-amber-400 italic font-serif">
                  Commercial Enterprise
                </span>{' '}
                & Industrial Growth.
              </h1>

              {/* Supporting Institutional Statement */}
              <p className="mt-5 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                The apex institutional network uniting 500+ manufacturing, wholesale, infrastructure, healthcare, and export enterprises across Jabalpur and the Mahakoshal commercial corridor.
              </p>

              {/* Institutional Enterprise Search Form */}
              <form
                onSubmit={handleSearchSubmit}
                className="mt-8 w-full max-w-xl rounded-xl bg-white p-2 shadow-2xl flex flex-col sm:flex-row gap-2 border-2 border-amber-400/60"
              >
                <div className="relative flex-1 flex items-center pl-3">
                  <Search className="h-4 w-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search 500+ enterprises, jewellers, steel, CAs…"
                    className="w-full bg-transparent px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>

                <div className="sm:border-l sm:border-slate-200 pl-2">
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="w-full bg-transparent py-2 pr-6 pl-2 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="">All 16 Sectors</option>
                    {SEED_INDUSTRIES.map((ind) => (
                      <option key={ind.id} value={ind.name}>
                        {ind.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#1540a8] hover:bg-[#07174a] text-white px-5 py-2.5 text-xs font-bold tracking-wide transition-all shadow-md cursor-pointer shrink-0"
                >
                  <span>Search Directory</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>

              {/* Action Links & Quick Tags */}
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href="/directory"
                  className="inline-flex items-center gap-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-[#07174a] px-5 py-2.5 text-xs font-bold shadow-lg transition-all"
                >
                  <span>Explore Verified Directory</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/membership"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 hover:bg-white/15 text-white px-5 py-2.5 text-xs font-semibold backdrop-blur transition-all"
                >
                  <span>+ Enrol Your Enterprise</span>
                </Link>
              </div>

              {/* Trust Accreditation Line */}
              <div className="mt-8 pt-5 border-t border-white/10 flex flex-wrap items-center gap-6 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                  <span>Government Recognized Body</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                  <span>B2B Dispute Arbitration</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                  <span>Central India Corridors</span>
                </div>
              </div>
            </div>

            {/* Right Column: Prestigious Corporate Photography Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400/70 shadow-2xl bg-stone-900 group">
                <div className="relative h-80 sm:h-96 w-full">
                  <Image
                    src="/images/conclave_hero.jpg"
                    alt="ACCI Central India Business Conclave"
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07174a] via-transparent to-black/30" />
                </div>

                {/* Overlaid Gold Badge */}
                <div className="absolute top-4 left-4 rounded-md bg-amber-400/95 text-[#07174a] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider shadow-md backdrop-blur-xs flex items-center gap-1.5">
                  <Award className="h-3 w-3" />
                  <span>Central India Business Conclave</span>
                </div>

                {/* Overlaid Bottom Details */}
                <div className="absolute bottom-0 inset-x-0 p-5 text-white bg-gradient-to-t from-[#07174a] to-transparent">
                  <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                    Annual Leadership Assembly • Jabalpur
                  </div>
                  <h3 className="font-serif-heading text-lg font-bold text-white mt-0.5">
                    600+ Industrial Captains, Policymakers & MSME Leaders
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                    Deliberating on the MP Industrial Policy, tax incentives, export infrastructure, and cross-border trade alliances.
                  </p>
                </div>
              </div>

              {/* Floating Notice Card */}
              <div className="hidden sm:flex items-center gap-3 absolute -bottom-5 -left-5 rounded-xl border border-amber-400/40 bg-[#07174a]/95 p-3.5 shadow-xl backdrop-blur-md text-white max-w-xs">
                <div className="relative h-11 w-11 rounded-lg overflow-hidden shrink-0 border border-amber-400 bg-white p-1">
                  <Image
                    src="/images/acci_logo.jpg"
                    alt="ACCI Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="text-[11px]">
                  <div className="font-bold text-amber-300">Office Bearers & Council</div>
                  <div className="text-slate-300">Secretariat, Napier Town, Jabalpur</div>
                </div>
              </div>
            </div>
          </div>

          {/* Chamber Vital Corporate Metrics Bar */}
          <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/30 transition-colors">
              <div className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-amber-400">
                500+
              </div>
              <div className="text-xs text-slate-300 mt-1 font-medium">
                Verified Member Enterprises
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/30 transition-colors">
              <div className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-amber-400">
                ₹2,500+ Cr
              </div>
              <div className="text-xs text-slate-300 mt-1 font-medium">
                Cumulative Regional Trade
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/30 transition-colors">
              <div className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-amber-400">
                16
              </div>
              <div className="text-xs text-slate-300 mt-1 font-medium">
                Core Industrial Sectors
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/30 transition-colors">
              <div className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-amber-400">
                24+ Years
              </div>
              <div className="text-xs text-slate-300 mt-1 font-medium">
                Institutional Trust & Legacy
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. PRESIDENT'S DESK / EXECUTIVE MESSAGE ───────────────────── */}
      <section className="py-14 bg-white border-b border-stone-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-6 sm:p-10 shadow-xs relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 opacity-5 font-serif text-9xl font-black text-[#07174a] pointer-events-none">
              ACCI
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* President Profile Block */}
              <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left border-b lg:border-b-0 lg:border-r border-stone-200 pb-6 lg:pb-0 lg:pr-8">
                <div className="relative h-24 w-24 rounded-2xl overflow-hidden shadow-md border-2 border-amber-500 mb-4 bg-white p-2">
                  <Image
                    src="/images/acci_logo.jpg"
                    alt="ACCI Official Emblem"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                  President&apos;s Secretariat
                </div>
                <h3 className="font-serif-heading text-xl font-bold text-[#07174a] mt-0.5">
                  Shri Sudhi Agrawal
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  President, ACCI Jabalpur<br />
                  Managing Director, Better Foods India
                </p>
                <div className="mt-4 pt-4 border-t border-stone-200 w-full flex items-center justify-between text-[11px] text-slate-500">
                  <span>Secretariat: Napier Town</span>
                  <Link href="/committee" className="text-[#1540a8] font-bold hover:underline">
                    Executive Council →
                  </Link>
                </div>
              </div>

              {/* President's Executive Message */}
              <div className="lg:col-span-8">
                <span className="text-xs font-bold uppercase tracking-widest text-[#1540a8]">
                  Institutional Mission & Guidance
                </span>
                <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#07174a] mt-1">
                  &ldquo;Building Resilient Enterprises, Upholding Commercial Dharma.&rdquo;
                </h2>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-700">
                  The Agrawal trading community has been the bedrock of commerce, wealth generation, and social welfare in Central India for generations. In an era of rapid supply-chain consolidation and digital transition, ACCI provides our local manufacturers, grain traders, jewellers, and professionals with the unified collective voice, transparent dispute resolution, and institutional clout required to scale with confidence.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#07174a] px-4 py-2 text-xs font-bold text-white hover:bg-[#1540a8] transition-colors"
                  >
                    <span>Read Chamber Charter & History</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="/news"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-stone-100 transition-colors"
                  >
                    <span>View Official Circulars</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. SECTORAL CLASSIFICATION (PHOTOGRAPHIC INDUSTRY GRID) ────── */}
      <section className="py-16 bg-[#faf8f5] border-b border-stone-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#1540a8]">
                Commercial Scope
              </span>
              <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#07174a] mt-1">
                Major Industry & Trade Sectors
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Representing heavy manufacturing, agro-mandi trading, logistics, bullion, and specialized advisory across Mahakoshal.
              </p>
            </div>
            <Link
              href="/directory"
              className="mt-4 sm:mt-0 text-xs sm:text-sm font-bold text-[#1540a8] hover:text-[#07174a] flex items-center gap-1 group"
            >
              <span>Explore All 70+ Sectors</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {SEED_INDUSTRIES.slice(0, 8).map((ind) => (
              <Link
                key={ind.id}
                href={`/directory?industry=${encodeURIComponent(ind.name)}`}
                className="group relative rounded-xl overflow-hidden border border-stone-300 shadow-xs hover:shadow-xl transition-all duration-300 bg-stone-900"
              >
                <div className="relative h-44 w-full">
                  <Image
                    src={ind.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'}
                    alt={ind.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07174a] via-[#07174a]/60 to-transparent" />
                </div>

                <div className="absolute bottom-0 inset-x-0 p-4 text-white">
                  <span className="inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-amber-400/90 text-[#07174a] mb-1.5">
                    {ind.category}
                  </span>
                  <h3 className="font-serif-heading text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    {ind.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-300 pt-2 border-t border-white/15">
                    <span>Verified Establishments</span>
                    <ArrowRight className="h-3 w-3 text-amber-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/directory"
              className="inline-flex items-center gap-2 rounded-lg bg-white border border-stone-300 hover:border-[#1540a8] px-6 py-2.5 text-xs font-bold text-slate-800 shadow-xs transition-all"
            >
              <span>View Directory for all 16 Classified Sectors</span>
              <ChevronRight className="h-3.5 w-3.5 text-[#1540a8]" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. FEATURED MEMBER ENTERPRISES (CORPORATE SHOWCASE) ──────── */}
      <section className="py-16 bg-white border-b border-stone-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
                Institutional Directory
              </span>
              <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#07174a] mt-1">
                Featured Member Enterprises
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Verified commercial establishments, manufacturers, and consulting firms operating across Central India.
              </p>
            </div>
            <Link
              href="/directory"
              className="mt-4 sm:mt-0 inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#1540a8] hover:underline"
            >
              <span>Search Full Directory</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredMembers.map((biz) => {
              const photo =
                biz.workPhotos && biz.workPhotos[0]
                  ? biz.workPhotos[0]
                  : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';

              return (
                <div
                  key={biz.id}
                  className="rounded-xl border border-stone-200 bg-white overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  {/* Photo Header with Category & Verification Badge */}
                  <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                    <Image
                      src={photo}
                      alt={biz.businessName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3">
                      <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider bg-[#07174a]/90 text-amber-300 border border-amber-400/40 backdrop-blur-xs">
                        {biz.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/90 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-xs">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Verified</span>
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-[10px] font-semibold text-amber-300 uppercase tracking-wider">
                        {biz.industry}
                      </div>
                      <h3
                        className="font-serif-heading text-lg font-bold text-white hover:text-amber-200 transition-colors cursor-pointer truncate"
                        onClick={() => setActiveModalMember(biz)}
                      >
                        {biz.businessName}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                        {biz.description}
                      </p>

                      <div className="space-y-2 text-xs text-slate-500 border-t border-stone-100 pt-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{biz.address}, {biz.city}</span>
                        </div>
                        {biz.gst && (
                          <div className="flex items-center gap-2">
                            <Shield className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                            <span className="font-mono text-emerald-700 font-semibold text-[11px]">
                              GST: {biz.gst}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400 shrink-0" />
                          <span className="font-bold text-slate-800">{biz.rating || 4.8}</span>
                          <span className="text-slate-400 text-[11px]">
                            ({biz.reviewCount || 12} community evaluations)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${biz.phone}`}
                          className="inline-flex items-center gap-1 rounded-md bg-[#1540a8] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#07174a] transition-colors"
                        >
                          <Phone className="h-3 w-3" />
                          <span>Call</span>
                        </a>
                        {biz.whatsapp && (
                          <a
                            href={`https://wa.me/${biz.whatsapp.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(biz.businessName)}%2C%20found%20you%20on%20ACCI%20Jabalpur.`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
                          >
                            <MessageSquare className="h-3 w-3" />
                            <span>WhatsApp</span>
                          </a>
                        )}
                      </div>

                      <button
                        onClick={() => setActiveModalMember(biz)}
                        className="text-xs font-bold text-[#07174a] hover:text-[#1540a8] underline cursor-pointer"
                      >
                        Company Profile →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. CHAMBER PHOTO ARCHIVES & MEMORIES GALLERY ─────────────── */}
      <section className="py-16 bg-[#07174a] text-white border-b border-amber-500/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Institutional Archives
              </span>
              <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-white mt-1">
                Chamber Conclaves & Historical Memories
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Visual documentation of annual industrial conclaves, trade delegations, and Agrasen Jayanti expos in Jabalpur.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center gap-2 text-xs text-amber-300">
              <Camera className="h-4 w-4" />
              <span>Official Media Archives</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SEED_GALLERY.map((album) => (
              <div
                key={album.id}
                onClick={() => setActiveGalleryItem(album)}
                className="group cursor-pointer rounded-xl overflow-hidden border border-white/20 bg-white/5 hover:border-amber-400 transition-all flex flex-col justify-between"
              >
                <div className="relative h-48 w-full bg-stone-800">
                  <Image
                    src={album.coverUrl}
                    alt={album.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <span className="absolute top-3 right-3 rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-white/20">
                    {album.photoCount} Photos
                  </span>
                  <span className="absolute bottom-3 left-3 rounded bg-amber-400 text-[#07174a] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                    {album.category}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif-heading text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                      {album.title}
                    </h3>
                    <p className="mt-1 text-[11px] text-slate-300 line-clamp-2">
                      {album.description}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                    <span>📍 {album.date}</span>
                    <span className="text-amber-400 font-semibold group-hover:underline">View Album</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. OFFICIAL CHAMBER GAZETTE & CIRCULARS ──────────────────── */}
      <section className="py-16 bg-[#faf8f5] border-b border-stone-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#1540a8]">
                Official Gazette
              </span>
              <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#07174a] mt-1">
                Chamber Circulars & Policy Memorandums
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Formal representations to state departments, GST/income tax alerts, and industrial corridor advisories.
              </p>
            </div>
            <Link
              href="/news"
              className="mt-4 sm:mt-0 text-xs sm:text-sm font-bold text-[#1540a8] hover:underline flex items-center gap-1"
            >
              <span>View All Circulars</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {chamberNews.map((article) => (
              <div
                key={article.id}
                className="rounded-xl border border-stone-200 bg-white p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="rounded bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                      {article.category}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {article.publishedAt}
                    </span>
                  </div>

                  <h3 className="font-serif-heading text-base font-bold text-[#07174a] hover:text-[#1540a8] transition-colors">
                    <Link href={`/news`}>{article.title}</Link>
                  </h3>

                  <p className="mt-2.5 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">Ref: ACCI/PUB/{article.id.slice(-4)}</span>
                  <Link
                    href={`/news`}
                    className="font-bold text-[#1540a8] hover:text-[#07174a] flex items-center gap-1"
                  >
                    <span>Read Memorandum</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. CONCLAVES & DELEGATIONS ───────────────────────────────── */}
      <section className="py-16 bg-white border-b border-stone-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#1540a8]">
                Assembly Calendar
              </span>
              <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#07174a] mt-1">
                Conclaves, Summits & Delegations
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Official business assemblies, MSME policy workshops, and trade fairs organized across Jabalpur.
              </p>
            </div>
            <Link
              href="/events"
              className="mt-4 sm:mt-0 text-xs sm:text-sm font-bold text-[#1540a8] hover:underline flex items-center gap-1"
            >
              <span>View Full Calendar</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((ev) => (
              <div
                key={ev.id}
                className="rounded-xl border border-stone-200 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Event Photo Header */}
                <div className="relative h-44 w-full bg-stone-800">
                  <Image
                    src={ev.imageUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'}
                    alt={ev.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Date Badge */}
                  <div className="absolute top-3 left-3 rounded-lg bg-[#07174a]/90 border border-amber-400/50 p-2 text-center text-white backdrop-blur-xs min-w-[50px]">
                    <div className="font-serif-heading text-lg font-black text-amber-300 leading-none">
                      {ev.date ? new Date(ev.date).getDate() : '18'}
                    </div>
                    <div className="text-[9px] uppercase font-bold text-slate-300">
                      {ev.date
                        ? new Date(ev.date).toLocaleString('default', { month: 'short' })
                        : 'OCT'}
                    </div>
                  </div>

                  <span className="absolute top-3 right-3 rounded bg-amber-400 text-[#07174a] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                    {ev.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif-heading text-base font-bold text-[#07174a] line-clamp-2">
                      {ev.title}
                    </h3>
                    <div className="mt-2.5 space-y-1 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{ev.time}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{ev.venue}</span>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-600 line-clamp-2">
                      {ev.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#1540a8] hover:text-[#07174a]"
                    >
                      <span>RSVP / Delegate Pass</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. COMMUNITY EMPLOYMENT EXCHANGE ─────────────────────────── */}
      <section className="py-16 bg-[#faf8f5] border-b border-stone-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
                Talent & Careers
              </span>
              <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#07174a] mt-1">
                Community Career Board
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Verified professional vacancies posted directly by member enterprises in Jabalpur.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-3">
              <Link
                href="/jobs/post"
                className="inline-flex items-center gap-1 text-xs font-bold bg-[#1540a8] text-white px-3.5 py-1.5 rounded-lg hover:bg-[#07174a]"
              >
                <span>+ Post a Vacancy</span>
              </Link>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#1540a8] hover:underline"
              >
                <span>View All Openings</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {job.category}
                    </span>
                    {job.urgency === 'Urgent' && (
                      <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        Urgent
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif-heading text-base font-bold text-[#07174a]">
                    {job.title}
                  </h3>
                  <div className="text-xs font-semibold text-amber-800 mt-0.5">
                    {job.company}
                  </div>
                  <div className="mt-3 space-y-1 text-xs text-slate-500">
                    <div className="font-medium text-slate-800">{job.salary}</div>
                    <div>📍 {job.location}</div>
                  </div>
                  <p className="mt-2.5 text-xs text-slate-600 line-clamp-2">
                    {job.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Posted on {job.postedAt}
                  </span>
                  <a
                    href={
                      job.contactWhatsApp
                        ? `https://wa.me/${job.contactWhatsApp.replace(/\D/g, '')}?text=Application%20for%20${encodeURIComponent(job.title)}%20at%20${encodeURIComponent(job.company)}`
                        : `mailto:${job.contactEmail}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded bg-[#1540a8] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#07174a]"
                  >
                    <span>Apply via WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. THREE-STEP ENTERPRISE ENROLMENT ───────────────────────── */}
      <section className="py-16 bg-gradient-to-br from-[#07174a] via-[#0b2168] to-[#040e30] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300 mb-3">
            Institutional Accreditation
          </div>
          <h2 className="font-serif-heading text-2xl sm:text-4xl font-extrabold text-white mt-1">
            Enrol Your Enterprise with ACCI in 3 Steps
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Become an officially verified business member of Jabalpur&apos;s apex trade alliance.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-left">
            <div className="rounded-xl border border-white/15 bg-white/5 p-6 backdrop-blur">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400 text-base font-bold text-[#07174a] mb-4">
                01
              </div>
              <h3 className="font-serif-heading text-base font-bold text-white">
                Submit Commercial Dossier
              </h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Provide basic details, GST / shop establishment certificate, core product portfolio, and contact coordinates.
              </p>
            </div>

            <div className="rounded-xl border border-white/15 bg-white/5 p-6 backdrop-blur">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400 text-base font-bold text-[#07174a] mb-4">
                02
              </div>
              <h3 className="font-serif-heading text-base font-bold text-white">
                Secretariat Vetting
              </h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                The ACCI Executive Council reviews trade authenticity and issues your official Chamber Membership Number.
              </p>
            </div>

            <div className="rounded-xl border border-white/15 bg-white/5 p-6 backdrop-blur">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400 text-base font-bold text-[#07174a] mb-4">
                03
              </div>
              <h3 className="font-serif-heading text-base font-bold text-white">
                Access B2B Network & Privileges
              </h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Your enterprise profile is published to the public directory and you gain voting rights, B2B arbitration, and summit passes.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <Link
              href="/membership"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-8 py-3.5 text-xs sm:text-sm font-bold text-[#07174a] shadow-xl hover:bg-amber-300 transition-all hover:scale-105"
            >
              <span>Enrol Your Enterprise Now — Free</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── MODAL: GALLERY LIGHTBOX VIEWER ───────────────────────────── */}
      {activeGalleryItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-[#07174a] text-white border border-amber-400/40 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  {activeGalleryItem.category} • {activeGalleryItem.date}
                </span>
                <h3 className="font-serif-heading text-lg font-bold text-white">
                  {activeGalleryItem.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveGalleryItem(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative h-96 sm:h-[480px] w-full bg-black">
              <Image
                src={activeGalleryItem.coverUrl}
                alt={activeGalleryItem.title}
                fill
                className="object-contain"
              />
            </div>

            <div className="p-4 bg-[#051136] text-xs text-slate-300 border-t border-white/10 flex items-center justify-between">
              <p className="max-w-2xl">{activeGalleryItem.description}</p>
              <span className="text-amber-400 font-bold shrink-0">
                {activeGalleryItem.photoCount} High-Resolution Negatives in Archive
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: BUSINESS DETAIL DRAWER ───────────────────────────── */}
      {activeModalMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-stone-200">
            <button
              onClick={() => setActiveModalMember(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-start gap-4 mb-4">
              <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden border border-amber-400 bg-stone-100">
                <Image
                  src={
                    activeModalMember.workPhotos && activeModalMember.workPhotos[0]
                      ? activeModalMember.workPhotos[0]
                      : '/images/acci_logo.jpg'
                  }
                  alt={activeModalMember.businessName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-100">
                  {activeModalMember.category} • {activeModalMember.industry}
                </span>
                <h2 className="font-serif-heading text-xl font-bold text-[#07174a] mt-1">
                  {activeModalMember.businessName}
                </h2>
                <div className="text-xs text-slate-500 font-medium">
                  Proprietor: {activeModalMember.ownerName}
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-amber-50/80 p-3.5 border border-amber-200/70 mb-4 text-xs text-amber-950 leading-relaxed">
              {activeModalMember.description}
            </div>

            {activeModalMember.detailed && (
              <div className="mb-4 text-xs text-slate-600 leading-relaxed">
                {activeModalMember.detailed}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 mb-6 bg-slate-50 p-4 rounded-xl border border-stone-200">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Address</span>
                <span>{activeModalMember.address}, {activeModalMember.city}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Operating Hours</span>
                <span>{activeModalMember.timing || 'Mon–Sat 10:00 AM – 07:30 PM'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone Contact</span>
                <a href={`tel:${activeModalMember.phone}`} className="text-blue-700 font-bold">{activeModalMember.phone}</a>
              </div>
              {activeModalMember.gst && (
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">GST Number</span>
                  <span className="font-mono text-emerald-700 font-semibold">{activeModalMember.gst}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={`tel:${activeModalMember.phone}`}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#1540a8] py-2.5 px-4 text-xs font-bold text-white hover:bg-[#07174a]"
              >
                <Phone className="h-4 w-4" />
                <span>Call Business</span>
              </a>
              {activeModalMember.whatsapp && (
                <a
                  href={`https://wa.me/${activeModalMember.whatsapp.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(activeModalMember.businessName)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 px-4 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>WhatsApp Inquiry</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
