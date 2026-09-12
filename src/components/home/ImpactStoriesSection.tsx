'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  MessageSquareQuote,
  Star,
  CheckCircle,
  Send,
  X,
  PlusCircle,
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ImpactStory } from '@/types';
import { storiesService } from '@/services/appwrite/stories';

export default function ImpactStoriesSection() {
  const [stories, setStories] = useState<ImpactStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Carousel & Floating State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Submission Form State
  const [form, setForm] = useState({
    authorName: '',
    businessName: '',
    roleOrDesignation: '',
    benefitCategory: 'B2B Sourcing',
    title: '',
    story: '',
    contactPhone: '',
    contactEmail: '',
    rating: 5,
  });

  const loadFeaturedStories = async () => {
    try {
      const list = await storiesService.getFeaturedStories();
      setStories(list);
    } catch (err) {
      console.warn('Failed to load featured impact stories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeaturedStories();
  }, []);

  // Automatic sliding when more than 3 stories are present
  useEffect(() => {
    if (stories.length <= 3 || isPaused) return;

    carouselTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stories.length);
    }, 4500);

    return () => {
      if (carouselTimerRef.current) clearInterval(carouselTimerRef.current);
    };
  }, [stories.length, isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? stories.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.authorName.trim() || !form.businessName.trim() || !form.story.trim()) {
      alert('Please provide your name, business name, and story.');
      return;
    }

    setSubmitting(true);
    try {
      await storiesService.createStory({
        title: form.title.trim() || `Impact Story: ${form.businessName.trim()}`,
        authorName: form.authorName.trim(),
        roleOrDesignation: form.roleOrDesignation.trim() || 'Business Owner',
        businessName: form.businessName.trim(),
        benefitCategory: form.benefitCategory,
        story: form.story.trim(),
        contactPhone: form.contactPhone.trim(),
        contactEmail: form.contactEmail.trim(),
        rating: form.rating,
      });

      setSubmittedSuccess(true);
      setForm({
        authorName: '',
        businessName: '',
        roleOrDesignation: '',
        benefitCategory: 'B2B Sourcing',
        title: '',
        story: '',
        contactPhone: '',
        contactEmail: '',
        rating: 5,
      });
    } catch (err) {
      console.error('Failed to submit impact story', err);
      alert('Something went wrong submitting your story. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const hasSlider = stories.length > 3;

  return (
    <section className="py-16 bg-[#f4f6fb] border-b border-stone-200 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header with Title & Action Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span>Real Experiences &amp; Growth</span>
            </div>
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#07174a]">
              Community Impact Stories
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Hear Stories from entrepreneurs, traders, and professionals who have grown their enterprises and solved business challenges through the ACCI.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
            {/* Carousel Controls if more than 3 stories */}
            {hasSlider && (
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-stone-200 shadow-xs">
                <button
                  onClick={handlePrev}
                  className="rounded-lg p-2 text-slate-600 hover:bg-stone-100 hover:text-[#07174a] transition-colors cursor-pointer"
                  title="Previous stories"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-[11px] font-mono font-bold text-slate-400 px-1">
                  {currentIndex + 1} / {stories.length}
                </span>
                <button
                  onClick={handleNext}
                  className="rounded-lg p-2 text-slate-600 hover:bg-stone-100 hover:text-[#07174a] transition-colors cursor-pointer"
                  title="Next stories"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

            <button
              onClick={() => {
                setSubmittedSuccess(false);
                setShowSubmitModal(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#07174a] hover:bg-[#1540a8] text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <PlusCircle className="h-4 w-4 text-amber-400" />
              <span>Share Your Impact Story</span>
            </button>
          </div>
        </div>

        {/* Stories Display */}
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading inspiring stories…</div>
        ) : stories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center max-w-md mx-auto">
            <MessageSquareQuote className="h-10 w-10 text-stone-300 mx-auto mb-3" />
            <h3 className="font-serif-heading text-base font-bold text-[#07174a]">
              No Featured Stories Yet
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Has the ACCI website or directory benefited your business? Be the first to share your experience!
            </p>
            <button
              onClick={() => {
                setSubmittedSuccess(false);
                setShowSubmitModal(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-[#07174a] px-4 py-2 text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Share Your Story</span>
            </button>
          </div>
        ) : hasSlider ? (
          /* SLIDING / FLOATING CAROUSEL (More than 3 stories) */
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-out gap-6"
                style={{
                  transform: `translateX(-${currentIndex * (100 / (stories.length >= 3 ? 3 : stories.length))}%)`,
                }}
              >
                {stories.map((item, idx) => (
                  <div
                    key={item.$id || item.id || idx}
                    className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 group relative flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-6 shadow-sm hover:shadow-xl hover:border-amber-400/80 transition-all duration-300"
                  >
                    <div>
                      {/* Top Bar: Benefit Tag & Rating */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                          {item.benefitCategory || 'Community Impact'}
                        </span>
                        <div className="flex items-center text-amber-400">
                          {[...Array(item.rating || 5)].map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>

                      {/* Story Title */}
                      <h3 className="font-serif-heading text-base font-bold text-[#07174a] group-hover:text-[#1540a8] transition-colors leading-snug mb-3">
                        "{item.title}"
                      </h3>

                      {/* Story Text */}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic bg-[#faf8f5] p-3.5 rounded-xl border border-stone-100 line-clamp-4">
                        {item.story}
                      </p>
                    </div>

                    {/* Author Info Footer */}
                    <div className="mt-5 pt-4 border-t border-stone-100 flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#07174a] to-[#1540a8] text-amber-300 font-serif-heading font-bold text-sm shadow-xs">
                        {item.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {item.authorName}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                          <Building2 className="h-3 w-3 text-amber-600 shrink-0" />
                          <span className="font-medium text-slate-700">{item.businessName}</span>
                          {item.roleOrDesignation && (
                            <span className="text-slate-400">• {item.roleOrDesignation}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Dot Indicators */}
            <div className="flex justify-center items-center gap-2 mt-8">
              {stories.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === i ? 'w-8 bg-[#07174a]' : 'w-2 bg-stone-300 hover:bg-stone-400'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* STANDARD 3-COLUMN GRID (When 1 to 3 stories) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((item) => (
              <div
                key={item.$id || item.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-6 shadow-sm hover:shadow-xl hover:border-amber-400/80 transition-all duration-300"
              >
                <div>
                  {/* Top Bar: Benefit Tag & Rating */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                      {item.benefitCategory || 'Community Impact'}
                    </span>
                    <div className="flex items-center text-amber-400">
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Story Title */}
                  <h3 className="font-serif-heading text-base font-bold text-[#07174a] group-hover:text-[#1540a8] transition-colors leading-snug mb-3">
                    "{item.title}"
                  </h3>

                  {/* Story Text */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic bg-[#faf8f5] p-3.5 rounded-xl border border-stone-100">
                    {item.story}
                  </p>
                </div>

                {/* Author Info Footer */}
                <div className="mt-5 pt-4 border-t border-stone-100 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#07174a] to-[#1540a8] text-amber-300 font-serif-heading font-bold text-sm shadow-xs">
                    {item.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {item.authorName}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                      <Building2 className="h-3 w-3 text-amber-600 shrink-0" />
                      <span className="font-medium text-slate-700">{item.businessName}</span>
                      {item.roleOrDesignation && (
                        <span className="text-slate-400">• {item.roleOrDesignation}</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Submission Modal ────────────────────────────────────── */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:bg-stone-100 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {submittedSuccess ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="font-serif-heading text-xl font-bold text-[#07174a]">
                  Thank You for Sharing Your Story!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                  Your impact story has been received. Once verified and approved by our team, it will be proudly featured on our main page.
                </p>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="mt-6 inline-flex items-center rounded-xl bg-[#07174a] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#1540a8] transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md mb-1.5">
                    <Sparkles className="h-3 w-3 text-amber-600" />
                    Chamber Member Feedback
                  </div>
                  <h3 className="font-serif-heading text-xl font-bold text-[#07174a]">
                    Share Your Success / Impact Story
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Tell us how listing your business or using ACCI services helped you connect, grow, or resolve a challenge.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Agrawal"
                        value={form.authorName}
                        onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-[#1540a8] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Enterprise / Business Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Agrawal Trading Co."
                        value={form.businessName}
                        onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-[#1540a8] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Your Role / Designation
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Managing Partner, Proprietor"
                        value={form.roleOrDesignation}
                        onChange={(e) => setForm({ ...form, roleOrDesignation: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-[#1540a8] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Key Area of Benefit
                      </label>
                      <select
                        value={form.benefitCategory}
                        onChange={(e) => setForm({ ...form, benefitCategory: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-[#1540a8] focus:outline-none bg-white cursor-pointer"
                      >
                        <option value="B2B Sourcing">B2B Sourcing &amp; Vendors</option>
                        <option value="Business Growth">Business Growth &amp; Orders</option>
                        <option value="Talent &amp; Hiring">Talent &amp; Hiring</option>
                        <option value="Networking">Networking &amp; Conclaves</option>
                        <option value="Credibility">Trust &amp; Verification</option>
                        <option value="Other">Other Community Benefit</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Headline Summary
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Secured 5 new bulk orders through directory listing"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-[#1540a8] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Your Detailed Experience / Story *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe how the ACCI website or Chamber network made a difference for your venture..."
                      value={form.story}
                      onChange={(e) => setForm({ ...form, story: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-3 text-slate-800 focus:border-[#1540a8] focus:outline-none leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98XXXXXXXX"
                        value={form.contactPhone}
                        onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-[#1540a8] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={form.contactEmail}
                        onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-[#1540a8] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowSubmitModal(false)}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#07174a] hover:bg-[#1540a8] px-5 py-2 font-bold text-white shadow transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5 text-amber-400" />
                      <span>{submitting ? 'Submitting…' : 'Submit for Review'}</span>
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
