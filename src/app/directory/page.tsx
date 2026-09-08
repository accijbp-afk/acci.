'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { membersService } from '@/services/appwrite/members';
import { notificationService } from '@/services/notifications';
import { SEED_CATEGORIES, SEED_INDUSTRIES } from '@/services/seedData';
import { MemberBusiness, BusinessReview } from '@/types';
import { getBusinessBanner } from '@/utils/businessImage';
import {
  Search,
  CheckCircle2,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  Star,
  Filter,
  X,
  ExternalLink,
  Building2,
  PlusCircle,
  Share2,
} from 'lucide-react';

function DirectoryContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || searchParams.get('cat') || '';
  const initialIndustry = searchParams.get('industry') || '';

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [industry, setIndustry] = useState(initialIndustry);
  const [members, setMembers] = useState<MemberBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModalMember, setActiveModalMember] = useState<MemberBusiness | null>(null);

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [targetVendor, setTargetVendor] = useState<MemberBusiness | null>(null);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [vendorReviews, setVendorReviews] = useState<BusinessReview[]>([]);

  const loadBusinesses = () => {
    setLoading(true);
    membersService
      .getMembers({
        search,
        category: category || undefined,
        industry: industry || undefined,
        status: 'approved',
      })
      .then((res) => {
        setMembers(res.members);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadBusinesses();
  }, [category, industry]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadBusinesses();
  };

  const handleOpenDetail = (biz: MemberBusiness) => {
    setActiveModalMember(biz);
    membersService.getReviews(biz.id).then(setVendorReviews);
  };

  const handleOpenReview = (biz: MemberBusiness) => {
    setTargetVendor(biz);
    setReviewModalOpen(true);
    setReviewSuccess(false);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetVendor || !reviewerName || !reviewText) return;

    await membersService.addReview({
      vendorId: targetVendor.id,
      businessName: targetVendor.businessName,
      reviewerName,
      rating: reviewRating,
      reviewText,
    });

    // Notify Secretariat Admin at accjbp@gmail.com
    notificationService.notifyAdmin({
      event: 'REVIEW_SUBMITTED',
      title: `New Review for ${targetVendor.businessName}`,
      subtitle: `${reviewerName} submitted a ${reviewRating}★ review.`,
      details: [
        { label: 'Target Business', value: targetVendor.businessName },
        { label: 'Reviewer Name', value: reviewerName },
        { label: 'Star Rating', value: `${reviewRating} / 5 Stars` },
        { label: 'Review Text', value: reviewText },
        { label: 'Proprietor Contact', value: targetVendor.phone },
      ],
      actionUrl: '/admin',
    });

    // Notify Member if business email exists
    if (targetVendor.email) {
      notificationService.notifyMember(targetVendor.email, {
        event: 'NEW_REVIEW_RECEIVED',
        title: `New ${reviewRating}★ Review Received: ${targetVendor.businessName}`,
        subtitle: `A chamber peer or customer has left feedback on your ACCI Chamber listing.`,
        details: [
          { label: 'Reviewer', value: reviewerName },
          { label: 'Rating Given', value: `${reviewRating} out of 5 Stars` },
          { label: 'Review Content', value: `"${reviewText}"` },
          { label: 'Chamber Listing', value: targetVendor.businessName },
        ],
        actionText: 'View in Chamber Directory',
        actionUrl: '/directory',
      });
    }

    setReviewSuccess(true);
    setTimeout(() => {
      setReviewModalOpen(false);
      setReviewerName('');
      setReviewText('');
      setReviewSuccess(false);
    }, 2000);
  };

  return (
    <div className="bg-[#faf8f5] min-h-screen pb-20">
      {/* Header Banner */}
      <section className="bg-[#07174a] text-white py-12 border-b-4 border-amber-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Official Community Directory
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-white mt-1">
            Agrawal Business Directory • Jabalpur
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl">
            Verified manufacturers, wholesale stockists, jewellers, and professional service firms serving Central India.
          </p>

          {/* Search form in Header */}
          <form
            onSubmit={handleSearch}
            className="mt-6 flex flex-col sm:flex-row gap-2 max-w-3xl rounded-xl bg-white p-2 shadow-lg"
          >
            <div className="flex-1 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search business name, owner name, service, keywords…"
                className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="">All Categories</option>
              {SEED_CATEGORIES.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="">All Industries</option>
              {SEED_INDUSTRIES.map((ind) => (
                <option key={ind.id} value={ind.name}>
                  {ind.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="rounded-lg bg-[#1540a8] hover:bg-[#07174a] text-white px-5 py-2 text-xs font-bold transition-all shadow"
            >
              Filter
            </button>
          </form>
        </div>
      </section>

      {/* Category Chips Bar */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 shadow-xs sticky top-[65px] z-20">
        <div className="mx-auto max-w-7xl flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => {
              setCategory('');
              setIndustry('');
              setSearch('');
            }}
            className={`px-3 py-1 text-xs font-semibold rounded-full shrink-0 transition-all ${
              !category && !industry && !search
                ? 'bg-[#07174a] text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Enterprises
          </button>
          {SEED_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(category === cat.name ? '' : cat.name)}
              className={`px-3 py-1 text-xs font-semibold rounded-full shrink-0 transition-all ${
                category === cat.name
                  ? 'bg-[#1540a8] text-white shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-8">
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {members.length} {members.length === 1 ? 'Business' : 'Businesses'} Found
          </div>
          <Link
            href="/membership"
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-3.5 py-1.5 text-xs font-bold text-[#07174a] hover:bg-amber-300 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>List Your Business — Free</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#1540a8] border-r-transparent" />
            <p className="mt-3 text-xs text-slate-500">Loading verified businesses…</p>
          </div>
        ) : members.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center max-w-lg mx-auto">
            <div className="text-4xl mb-3">🏪</div>
            <h3 className="font-serif-heading text-lg font-bold text-[#07174a]">
              No businesses found
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search criteria or category filter.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setCategory('');
                setIndustry('');
              }}
              className="mt-4 inline-block rounded-md bg-[#1540a8] px-4 py-2 text-xs font-bold text-white"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((biz) => {
              const photo = getBusinessBanner(biz);

              return (
                <div
                  key={biz.id}
                  className="rounded-xl border border-stone-200 bg-white shadow-xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
                >
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
                        onClick={() => handleOpenDetail(biz)}
                        className="font-serif-heading text-lg font-bold text-white hover:text-amber-200 transition-colors cursor-pointer truncate"
                      >
                        {biz.businessName}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                        {biz.description}
                      </p>

                  <div className="space-y-1 text-xs text-slate-500 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{biz.address}, {biz.city}</span>
                    </div>
                    {biz.timing && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{biz.timing}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-amber-500 font-semibold">
                      <Star className="h-3.5 w-3.5 fill-amber-400 shrink-0" />
                      <span className="text-slate-800">{biz.rating || 4.8}</span>
                      <span className="text-slate-400 text-[11px]">({biz.reviewCount || 10} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 bg-[#faf8f5] px-5 py-3 flex items-center justify-between gap-2">
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
                        href={`https://wa.me/${biz.whatsapp.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(biz.businessName)}%2C%20found%20you%20on%20ACCI%20Jabalpur.`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
                      >
                        <MessageSquare className="h-3 w-3" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleOpenReview(biz)}
                      className="text-[11px] font-semibold text-slate-500 hover:text-amber-700 cursor-pointer"
                    >
                      ★ Review
                    </button>
                    <button
                      onClick={() => handleOpenDetail(biz)}
                      className="text-xs font-bold text-slate-700 hover:text-[#07174a] underline cursor-pointer"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
            );
          })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {activeModalMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <button
              onClick={() => setActiveModalMember(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800"
            >
              ✕
            </button>

            <div className="flex items-start gap-4 mb-4">
              <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden border border-amber-400 bg-stone-100">
                <Image
                  src={getBusinessBanner(activeModalMember)}
                  alt={activeModalMember.businessName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                  {activeModalMember.category} • {activeModalMember.industry}
                </span>
                <h2 className="font-serif-heading text-xl font-bold text-[#07174a] mt-1">
                  {activeModalMember.businessName}
                </h2>
                <div className="text-xs text-slate-500 font-medium">
                  Founder/Owner: {activeModalMember.ownerName}
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-amber-50/70 p-3.5 border border-amber-200/60 mb-4 text-xs text-amber-900 leading-relaxed">
              {activeModalMember.description}
            </div>

            {activeModalMember.detailed && (
              <div className="mb-4 text-xs text-slate-600 leading-relaxed">
                {activeModalMember.detailed}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Address</span>
                <span>{activeModalMember.address}, {activeModalMember.city}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Operating Timing</span>
                <span>{activeModalMember.timing || 'Mon–Sat 10:00 AM – 07:30 PM'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone Number</span>
                <a href={`tel:${activeModalMember.phone}`} className="text-blue-700 font-bold">{activeModalMember.phone}</a>
              </div>
              {activeModalMember.gst && (
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">GST Number</span>
                  <span className="font-mono text-emerald-700 font-semibold">{activeModalMember.gst}</span>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="border-t border-slate-200 pt-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-serif-heading text-sm font-bold text-[#07174a]">
                  Community Reviews & Ratings
                </h4>
                <button
                  onClick={() => {
                    setActiveModalMember(null);
                    handleOpenReview(activeModalMember);
                  }}
                  className="text-xs font-bold text-[#1540a8] hover:underline"
                >
                  + Write a Review
                </button>
              </div>

              {vendorReviews.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No approved reviews yet. Be the first to review!</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {vendorReviews.map((rev) => (
                    <div key={rev.id} className="rounded-lg bg-slate-50 p-3 text-xs border border-slate-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-800">{rev.reviewerName}</span>
                        <span className="text-amber-500">{'★'.repeat(rev.rating)}</span>
                      </div>
                      <p className="text-slate-600">{rev.reviewText}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Review Submission Modal */}
      {reviewModalOpen && targetVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <button
              onClick={() => setReviewModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100"
            >
              ✕
            </button>

            <h3 className="font-serif-heading text-lg font-bold text-[#07174a]">
              Write a Review
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Reviewing: <strong className="text-slate-800">{targetVendor.businessName}</strong>
            </p>

            {reviewSuccess ? (
              <div className="rounded-lg bg-emerald-50 p-4 text-emerald-800 text-xs font-semibold text-center my-6">
                ✅ Thank you! Your review has been submitted for verification.
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className={`text-2xl cursor-pointer ${
                          star <= reviewRating ? 'text-amber-400' : 'text-slate-200'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="e.g. Ramesh Agrawal"
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Feedback</label>
                  <textarea
                    required
                    rows={3}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience dealing with this business…"
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#1540a8] py-2.5 text-xs font-bold text-white hover:bg-[#07174a] transition-colors"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DirectoryPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">Loading Chamber Directory…</div>}>
      <DirectoryContent />
    </Suspense>
  );
}
