'use client';

import React, { useState, useEffect } from 'react';
import { legalService } from '@/services/appwrite/legal';
import { LegalDocument } from '@/types';
import { LegalContentRenderer } from '@/components/common/LegalContentRenderer';
import { Calendar } from 'lucide-react';

export default function PrivacyPage() {
  const [policy, setPolicy] = useState<LegalDocument>(() => legalService.getDefaults('privacy'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    legalService.getLegalContent('privacy').then((data) => {
      setPolicy(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-[#faf8f5] min-h-screen py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1540a8] bg-blue-50 px-2.5 py-1 rounded-md">
              {policy.categoryBadge || 'Information Protection'}
            </span>
            {policy.lastUpdated && (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                <Calendar className="h-3 w-3" />
                Updated: {policy.lastUpdated}
              </span>
            )}
          </div>

          <h1 className="font-serif-heading text-2xl sm:text-4xl font-bold text-[#07174a] mt-1 mb-6 pb-4 border-b border-slate-200">
            {policy.title}
          </h1>

          <LegalContentRenderer content={policy.content} />
        </div>
      </div>
    </div>
  );
}
