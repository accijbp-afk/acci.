'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="bg-[#faf8f5] min-h-screen py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#1540a8]">
            Legal Governance & Bylaws
          </span>
          <h1 className="font-serif-heading text-2xl sm:text-4xl font-bold text-[#07174a] mt-1 mb-6 pb-4 border-b border-slate-200">
            Terms & Conditions of Chamber Affiliation
          </h1>

          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-6">
            <section>
              <h2 className="font-serif-heading text-lg font-bold text-[#07174a] mb-2">
                1. Institutional Preamble
              </h2>
              <p>
                The Agrawal Chamber of Commerce & Industries (ACCI), Jabalpur is an apex trade and commercial organization operating under the highest standards of mercantile ethics and community welfare. By applying for membership, registering an enterprise, posting vacancies, or utilizing this portal, you agree to comply with the Chamber bylaws and governing guidelines.
              </p>
            </section>

            <section>
              <h2 className="font-serif-heading text-lg font-bold text-[#07174a] mb-2">
                2. Membership Eligibility & Verification
              </h2>
              <p>
                All enterprises listed in the directory must belong to members of the Agrawal community or their legally recognized partnerships and corporate entities. The ACCI Secretariat reserves the right to request physical or documentary verification of business credentials, GST registrations, or trade licenses before according verified status.
              </p>
            </section>

            <section>
              <h2 className="font-serif-heading text-lg font-bold text-[#07174a] mb-2">
                3. Directory Accuracy & Code of Conduct
              </h2>
              <p>
                Members must provide genuine, non-misleading details regarding their goods, services, and commercial terms. Spurious trade listings, fraudulent claims, or conduct detrimental to the community reputation will result in immediate delisting and revocation of Chamber privileges upon council resolution.
              </p>
            </section>

            <section>
              <h2 className="font-serif-heading text-lg font-bold text-[#07174a] mb-2">
                4. Commercial Mediation & Arbitration
              </h2>
              <p>
                ACCI offers conciliation and voluntary commercial dispute resolution between member enterprises through its Senior Advisory Panel. Decisions reached through formal Chamber conciliation are considered morally binding upon members honoring community traditions.
              </p>
            </section>

            <section>
              <h2 className="font-serif-heading text-lg font-bold text-[#07174a] mb-2">
                5. Secretariat Contact
              </h2>
              <p>
                For official legal notices or Chamber constitution queries, please write to: <a href="mailto:accijabalpur@gmail.com" className="text-blue-700 font-semibold">accijabalpur@gmail.com</a> or visit the Secretariat at Civic Centre, Jabalpur.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
