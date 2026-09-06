'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/appwrite/auth';
import { membersService } from '@/services/appwrite/members';
import { jobsService } from '@/services/appwrite/jobs';
import { UserProfile, MemberBusiness, JobListing } from '@/types';
import {
  User,
  Building2,
  Briefcase,
  PlusCircle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  LogOut,
  ExternalLink,
} from 'lucide-react';

export default function MemberDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'business' | 'jobs'>('profile');
  const [myBusiness, setMyBusiness] = useState<MemberBusiness | null>(null);
  const [myJobs, setMyJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getCurrentUser().then((currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      // Load businesses associated with current user or fallback
      membersService.getMembers({ status: 'all' }).then((res) => {
        const found =
          res.members.find(
            (m) =>
              m.userId === currentUser.userId ||
              m.ownerName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0])
          ) || res.members[0];
        setMyBusiness(found || null);
      });

      jobsService.getJobs().then((jbs) => {
        setMyJobs(jbs.slice(0, 2));
      });

      setLoading(false);
    });
  }, [router]);

  const handleLogout = async () => {
    await authService.logout();
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#1540a8] border-r-transparent" />
        <p className="mt-3 text-xs text-slate-500">Loading Member Portal…</p>
      </div>
    );
  }

  return (
    <div className="bg-[#faf8f5] min-h-screen py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Profile Card Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#07174a] font-serif text-2xl font-bold text-amber-400 shadow">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#07174a]">
                  {user.name}
                </h1>
                <span className="rounded bg-amber-100 text-amber-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  {user.role} Member
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{user.email} • {user.city || 'Jabalpur'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {user.role === 'admin' && (
              <Link
                href="/admin"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Admin Panel</span>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-4 transition-colors border-b-2 cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#1540a8] text-[#1540a8]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Digital Membership ID
          </button>
          <button
            onClick={() => setActiveTab('business')}
            className={`pb-3 px-4 transition-colors border-b-2 cursor-pointer ${
              activeTab === 'business'
                ? 'border-[#1540a8] text-[#1540a8]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            My Enterprise Listing
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`pb-3 px-4 transition-colors border-b-2 cursor-pointer ${
              activeTab === 'jobs'
                ? 'border-[#1540a8] text-[#1540a8]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Posted Vacancies
          </button>
        </div>

        {/* Tab 1: Digital Membership Card */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Digital ID Card Mockup */}
            <div className="rounded-2xl border-2 border-amber-400 bg-gradient-to-br from-[#07174a] via-[#0b2168] to-[#040e30] p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 font-serif text-8xl font-black text-white pointer-events-none">
                ACCI
              </div>

              <div className="flex items-center justify-between border-b border-white/20 pb-4 mb-6">
                <div>
                  <div className="text-[10px] tracking-widest text-amber-300 font-bold uppercase">
                    Agrawal Chamber of Commerce & Industries
                  </div>
                  <div className="font-serif-heading font-bold text-lg text-white">
                    Official Member Pass
                  </div>
                </div>
                <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-amber-400 shadow shrink-0 bg-white p-1">
                  <Image
                    src="/images/acci_logo.jpg"
                    alt="ACCI Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="space-y-3 text-xs mb-6">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Member Name</span>
                  <span className="font-bold text-base text-white">{user.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Membership ID</span>
                    <span className="font-mono text-amber-300 font-bold">ACCI-{user.userId.slice(-6).toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Affiliated Chapter</span>
                    <span className="text-white font-medium">{user.city || 'Jabalpur'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/20 flex items-center justify-between text-[11px] text-slate-300">
                <span>Verified Status: Active</span>
                <span className="text-amber-400 font-bold">Patron / Member</span>
              </div>
            </div>

            {/* Account Details Box */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 text-xs">
              <h3 className="font-serif-heading text-base font-bold text-[#07174a]">
                Member Account Details
              </h3>
              <div className="space-y-3 text-slate-700">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Full Name</span>
                  <span className="font-bold">{user.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Email Address</span>
                  <span className="font-mono">{user.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Registered City</span>
                  <span>{user.city || 'Jabalpur'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Enrolment Date</span>
                  <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Business Listing */}
        {activeTab === 'business' && (
          <div>
            {myBusiness ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                      {myBusiness.category} • {myBusiness.industry}
                    </span>
                    <h2 className="font-serif-heading text-xl font-bold text-[#07174a] mt-1">
                      {myBusiness.businessName}
                    </h2>
                    <p className="text-xs text-slate-500">Proprietor: {myBusiness.ownerName}</p>
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Listing Status: {myBusiness.status.toUpperCase()}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl mb-6">
                  <div>
                    <strong className="block text-slate-500 text-[10px] uppercase font-bold">Address</strong>
                    <span>{myBusiness.address}, {myBusiness.city}</span>
                  </div>
                  <div>
                    <strong className="block text-slate-500 text-[10px] uppercase font-bold">Contact Phone</strong>
                    <span>{myBusiness.phone}</span>
                  </div>
                  <div>
                    <strong className="block text-slate-500 text-[10px] uppercase font-bold">GST Number</strong>
                    <span className="font-mono text-emerald-700">{myBusiness.gst || 'Not Provided'}</span>
                  </div>
                  <div>
                    <strong className="block text-slate-500 text-[10px] uppercase font-bold">Operating Hours</strong>
                    <span>{myBusiness.timing}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Link
                    href={`/directory?search=${encodeURIComponent(myBusiness.businessName)}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#1540a8] px-4 py-2 text-xs font-bold text-white hover:bg-[#07174a]"
                  >
                    <span>View Public Card in Directory</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center max-w-lg mx-auto">
                <Building2 className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                <h3 className="font-serif-heading text-lg font-bold text-[#07174a]">
                  No Enterprise Listing Associated
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-6">
                  List your business to get verified on the official ACCI Jabalpur Directory.
                </p>
                <Link
                  href="/membership"
                  className="rounded-lg bg-amber-400 px-5 py-2.5 text-xs font-bold text-[#07174a] hover:bg-amber-300"
                >
                  List Business Now
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: My Jobs */}
        {activeTab === 'jobs' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div>
                <h2 className="font-serif-heading text-lg font-bold text-[#07174a]">
                  Community Vacancies
                </h2>
                <p className="text-xs text-slate-500">Positions posted from your enterprise.</p>
              </div>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-1 rounded-lg bg-[#1540a8] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#07174a]"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>+ Post New Job</span>
              </Link>
            </div>

            <div className="space-y-4">
              {myJobs.map((j) => (
                <div key={j.id} className="rounded-xl border border-slate-200 p-4 text-xs flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-[#07174a] text-sm">{j.title}</h3>
                    <div className="text-slate-500 mt-0.5">
                      {j.company} • 📍 {j.location} • 💰 {j.salary}
                    </div>
                  </div>
                  <span className="rounded bg-emerald-50 text-emerald-700 px-2 py-0.5 font-bold border border-emerald-200">
                    {j.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
