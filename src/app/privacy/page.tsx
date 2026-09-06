'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="bg-[#faf8f5] min-h-screen py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#1540a8]">
            Information Protection
          </span>
          <h1 className="font-serif-heading text-2xl sm:text-4xl font-bold text-[#07174a] mt-1 mb-6 pb-4 border-b border-slate-200">
            Privacy Policy & Data Standards
          </h1>

          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-6">
            <section>
              <h2 className="font-serif-heading text-lg font-bold text-[#07174a] mb-2">
                1. Data Protection Commitment
              </h2>
              <p>
                The Agrawal Chamber of Commerce & Industries (ACCI), Jabalpur is committed to safeguarding the privacy and commercial confidentiality of its members, delegates, and website visitors. We collect only information strictly necessary for commercial networking, directory listings, and administrative communication.
              </p>
            </section>

            <section>
              <h2 className="font-serif-heading text-lg font-bold text-[#07174a] mb-2">
                2. Information We Collect
              </h2>
              <p>
                When you list an enterprise or create a member account, we collect:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Enterprise trade name, founder name, and business address.</li>
                <li>Contact telephone, WhatsApp number, and commercial email.</li>
                <li>Industry classification, GST details, and service/product catalogues.</li>
                <li>Delegate pass details for Chamber conclaves and symposiums.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif-heading text-lg font-bold text-[#07174a] mb-2">
                3. Purpose of Processing
              </h2>
              <p>
                Your data is utilized exclusively to display public commercial directory cards, enable direct buyer inquiries via phone or WhatsApp, issue official event badges, and dispatch important Chamber circulars or taxation notices. We do not sell or monetize member data to third-party marketing brokers.
              </p>
            </section>

            <section>
              <h2 className="font-serif-heading text-lg font-bold text-[#07174a] mb-2">
                4. Appwrite Backend Infrastructure
              </h2>
              <p>
                Authentication and database operations are managed via secure Appwrite backend services with strict role-based access control and encrypted session management.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
