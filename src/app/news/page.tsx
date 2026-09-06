'use client';

import React, { useState, useEffect } from 'react';
import { newsService } from '@/services/appwrite/news';
import { ChamberNews } from '@/types';
import { Calendar, User, ArrowRight, Newspaper, FileText } from 'lucide-react';

export default function NewsPage() {
  const [news, setNews] = useState<ChamberNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeArticle, setActiveArticle] = useState<ChamberNews | null>(null);

  useEffect(() => {
    newsService.getNews().then((res) => {
      setNews(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-[#faf8f5] min-h-screen pb-20">
      {/* Header */}
      <section className="bg-[#07174a] text-white py-14 border-b-4 border-amber-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Official Secretariat Communications
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-5xl font-bold text-white mt-1">
            Trade Advisories, Circulars & News
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl">
            Official government gazette updates, MSME taxation circulars, Chamber representations, and regional commercial notices from ACCI Jabalpur.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-10">
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#1540a8] border-r-transparent" />
            <p className="mt-3 text-xs text-slate-500">Loading circulars…</p>
          </div>
        ) : news.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center max-w-md mx-auto">
            <p className="text-xs text-slate-500">No circulars published at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="bg-slate-100 p-4 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{item.publishedAt}</span>
                    </span>
                  </div>

                  <div className="p-6">
                    <h2 className="font-serif-heading text-lg font-bold text-[#07174a] line-clamp-2">
                      {item.title}
                    </h2>
                    <p className="mt-3 text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {item.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium truncate max-w-[180px]">
                    By {item.author}
                  </span>
                  <button
                    onClick={() => setActiveArticle(item)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1540a8] hover:text-[#07174a] cursor-pointer"
                  >
                    <span>Read Circular</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Full Article Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-7 shadow-2xl border border-slate-200">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100"
            >
              ✕
            </button>

            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
              {activeArticle.category}
            </span>

            <h2 className="font-serif-heading text-2xl font-bold text-[#07174a] mt-2 mb-2">
              {activeArticle.title}
            </h2>

            <div className="text-xs text-slate-500 mb-6 pb-3 border-b border-slate-200 flex items-center gap-4">
              <span>Published on {activeArticle.publishedAt}</span>
              <span>•</span>
              <span>Issued by {activeArticle.author}</span>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4 whitespace-pre-wrap">
              {activeArticle.content}
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="rounded-lg bg-[#07174a] px-5 py-2 text-xs font-bold text-white hover:bg-[#1540a8]"
              >
                Close Circular
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
