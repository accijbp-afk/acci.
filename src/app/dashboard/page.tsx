'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/appwrite/auth';
import { membersService } from '@/services/appwrite/members';
import { jobsService } from '@/services/appwrite/jobs';
import { storageService } from '@/services/appwrite/storage';
import { notificationService } from '@/services/notifications';
import { UserProfile, MemberBusiness, JobListing } from '@/types';
import { getBusinessBanner, getIndustryFallbackImage } from '@/utils/businessImage';
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
  Upload,
  Camera,
  Check,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function MemberDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'business' | 'jobs'>('profile');
  const [myBusiness, setMyBusiness] = useState<MemberBusiness | null>(null);
  const [myJobs, setMyJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);

  const [bannerInputUrl, setBannerInputUrl] = useState('');
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(null);
  const [savingBanner, setSavingBanner] = useState(false);
  const [bannerSuccess, setBannerSuccess] = useState(false);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSaveBanner = async (directUrl?: string, directFile?: File) => {
    if (!myBusiness) return;
    setSavingBanner(true);
    let targetUrl = directUrl || bannerInputUrl.trim() || bannerPreview || '';
    const fileToUpload = directFile || selectedBannerFile;

    // If a local file was selected, upload via storageService for a clean permanent URL
    if (fileToUpload) {
      try {
        const uploadedUrl = await storageService.uploadFile(fileToUpload);
        if (uploadedUrl) {
          targetUrl = uploadedUrl;
        }
      } catch (uploadErr) {
        console.warn('Storage upload notice, falling back to direct URL:', uploadErr);
      }
    }

    if (!targetUrl) {
      setSavingBanner(false);
      return;
    }

    const updated = await membersService.updateMember(myBusiness.id, {
      bannerUrl: targetUrl,
      workPhotos: [targetUrl],
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem(`acci_banner_${myBusiness.id}`, targetUrl);
      if (myBusiness.$id) {
        localStorage.setItem(`acci_banner_${myBusiness.$id}`, targetUrl);
      }
      if (myBusiness.businessName) {
        localStorage.setItem(`acci_banner_name_${encodeURIComponent(myBusiness.businessName.trim().toLowerCase())}`, targetUrl);
      }
    }

    if (updated) {
      setMyBusiness({ ...updated, bannerUrl: targetUrl, workPhotos: [targetUrl] });
      setBannerSuccess(true);
      setBannerPreview(targetUrl);
      setSelectedBannerFile(null);
      setTimeout(() => setBannerSuccess(false), 4000);

      // Trigger email to registered member's email
      if (user?.email) {
        notificationService.notifyMember(user.email, {
          event: 'PROFILE_UPDATED',
          title: `Enterprise Display Banner Updated: ${myBusiness.businessName}`,
          subtitle: `Your enterprise display banner for "${myBusiness.businessName}" has been successfully updated on the ACCI Jabalpur Portal.`,
          details: [
            { label: 'Enterprise Name', value: myBusiness.businessName },
            { label: 'Industry Sector', value: myBusiness.industry },
            { label: 'Update Date', value: new Date().toLocaleDateString('en-IN') },
            { label: 'Listing Status', value: 'Live on Directory & Spotlight' },
          ],
          actionText: 'View Public Listing',
          actionUrl: `/directory?search=${encodeURIComponent(myBusiness.businessName)}`,
        });
      }
    }
    setSavingBanner(false);
  };

  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBannerError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const img = new window.Image();
      img.onload = async () => {
        try {
          // Crop and resize to 1200x500 landscape canvas
          const targetW = 1200;
          const targetH = 500;
          const canvas = document.createElement('canvas');
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext('2d');

          if (ctx) {
            const targetAspect = targetW / targetH;
            const imgAspect = img.naturalWidth / img.naturalHeight;
            let sx = 0, sy = 0, sWidth = img.naturalWidth, sHeight = img.naturalHeight;

            if (imgAspect > targetAspect) {
              sWidth = img.naturalHeight * targetAspect;
              sx = (img.naturalWidth - sWidth) / 2;
            } else {
              sHeight = img.naturalWidth / targetAspect;
              sy = (img.naturalHeight - sHeight) / 2;
            }

            ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetW, targetH);
            const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);

            setBannerPreview(optimizedDataUrl);
            setBannerInputUrl(optimizedDataUrl);

            canvas.toBlob(async (blob) => {
              let uploadFile = file;
              if (blob) {
                uploadFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), { type: 'image/jpeg' });
              }
              setSelectedBannerFile(uploadFile);
              // Auto-save immediately so clicking/uploading on image changes banner live
              await handleSaveBanner(optimizedDataUrl, uploadFile);
            }, 'image/jpeg', 0.88);
          } else {
            // Fallback if canvas 2D not available
            setBannerPreview(result);
            setSelectedBannerFile(file);
            await handleSaveBanner(result, file);
          }
        } catch (cropErr) {
          console.warn('Canvas optimization notice, using raw file:', cropErr);
          setBannerPreview(result);
          setSelectedBannerFile(file);
          await handleSaveBanner(result, file);
        }
      };

      img.onerror = () => {
        setBannerError('Unable to process the image file. Please choose a valid JPG, PNG, or WebP photo.');
        setBannerPreview(null);
      };

      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleResetToFallback = async () => {
    if (!myBusiness) return;
    setSavingBanner(true);

    if (typeof window !== 'undefined') {
      localStorage.removeItem(`acci_banner_${myBusiness.id}`);
    }

    const updated = await membersService.updateMember(myBusiness.id, {
      bannerUrl: '',
      workPhotos: [],
    });

    if (updated) {
      setMyBusiness({ ...updated, bannerUrl: '', workPhotos: [] });
      setBannerInputUrl('');
      setBannerPreview(null);
      setSelectedBannerFile(null);
      setBannerSuccess(true);
      setTimeout(() => setBannerSuccess(false), 3500);

      // Trigger email to registered member's email (Requirement 5)
      if (user?.email) {
        notificationService.notifyMember(user.email, {
          event: 'PROFILE_UPDATED',
          title: `Enterprise Banner Reset: ${myBusiness.businessName}`,
          subtitle: `Your banner has been reset to the official ACCI industry image.`,
          details: [
            { label: 'Enterprise Name', value: myBusiness.businessName },
            { label: 'Current Display', value: `Official ${myBusiness.industry} Industry Image` },
          ],
          actionText: 'Open Member Dashboard',
          actionUrl: '/dashboard',
        });
      }
    }
    setSavingBanner(false);
  };

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

        {/* Onboarding Callout for New Members without an Enterprise */}
        {!myBusiness && (
          <div className="mb-8 rounded-2xl border-2 border-amber-400 bg-gradient-to-r from-[#07174a] via-[#0b2168] to-[#07174a] p-6 sm:p-7 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 animate-in fade-in">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 text-amber-300 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-amber-400/30">
                <Sparkles className="h-3 w-3 text-amber-300" />
                <span>Next Step • Register Your Enterprise</span>
              </div>
              <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-white">
                Welcome to ACCI, {user.name}!
              </h3>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Your member account is active. To list your business in the official Jabalpur trade directory, get verified, and access member benefits, register your enterprise today.
              </p>
            </div>
            <Link
              href="/membership"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 text-xs font-bold text-[#07174a] hover:bg-amber-300 transition-all shadow-md shrink-0 hover:scale-105 cursor-pointer"
            >
              <Building2 className="h-4 w-4" />
              <span>Register Your Enterprise Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

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

                {/* Enterprise Display Banner Manager */}
                <div className="rounded-xl border border-slate-200 bg-stone-50/80 p-5 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <h4 className="font-serif-heading text-sm font-bold text-[#07174a]">
                        Enterprise Display Banner / Photo
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        This image appears on your directory card and company profile. If left empty, an official image corresponding to your industry ({myBusiness.industry}) is automatically displayed.
                      </p>
                    </div>
                    <div>
                      {myBusiness.bannerUrl ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold">
                          <Check className="h-3 w-3" />
                          Custom Banner Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-[10px] font-bold">
                          Industry Fallback Active
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Banner Live Preview & Direct Click-on-Image Upload */}
                  <div
                    onClick={() => bannerFileInputRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        bannerFileInputRef.current?.click();
                      }
                    }}
                    title="Click on image to upload custom enterprise banner"
                    className="group relative h-48 sm:h-60 w-full rounded-2xl overflow-hidden border-2 border-dashed border-stone-300 hover:border-[#1540a8] bg-stone-900 mb-4 shadow-sm cursor-pointer transition-all duration-300"
                  >
                    <Image
                      src={bannerPreview || getBusinessBanner(myBusiness)}
                      alt={myBusiness.businessName}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Interactive Hover Overlay on the Image */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-4 text-center">
                      <div className="rounded-full bg-white/25 p-3.5 backdrop-blur-md border border-white/40 mb-2.5 shadow-lg group-hover:scale-110 transition-transform">
                        <Camera className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-white text-xs sm:text-sm font-bold tracking-wide bg-[#07174a]/85 px-4 py-1.5 rounded-full border border-white/30 shadow-md">
                        Click on image to upload new banner
                      </span>
                      <span className="text-white/85 text-[11px] mt-1.5 drop-shadow">
                        JPG, PNG, WebP • Auto-fits 1200 × 500 banner aspect
                      </span>
                    </div>

                    {/* Top Right "Change Banner Photo" Action Badge */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-black/65 hover:bg-black/85 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 border border-white/30 shadow-md transition-all">
                        <Camera className="h-3.5 w-3.5 text-amber-400" />
                        <span>Change Banner (Click on Image)</span>
                      </span>
                    </div>

                    {/* Bottom Info Overlay */}
                    <div className="absolute bottom-3 left-3 text-white pointer-events-none z-10">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-[#07174a] px-2 py-0.5 rounded font-bold shadow-xs">
                        {myBusiness.industry}
                      </span>
                      <div className="font-serif-heading font-bold text-sm sm:text-base mt-1 drop-shadow">
                        {myBusiness.businessName}
                      </div>
                    </div>

                    {/* Uploading indicator over the image if active */}
                    {savingBanner && (
                      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/75 backdrop-blur-xs text-white">
                        <div className="h-8 w-8 animate-spin rounded-full border-3 border-amber-400 border-t-transparent mb-2" />
                        <span className="text-xs font-bold text-white">Uploading & Applying Banner…</span>
                      </div>
                    )}
                  </div>

                  {/* Hidden file input controlled by image click and button */}
                  <input
                    ref={bannerFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBannerFileUpload}
                    className="hidden"
                  />

                  {/* Upload Controls */}
                  <div className="space-y-3">
                    {/* Dimension & File Size Guidance */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 bg-white border border-stone-200 rounded-lg px-3.5 py-2 shadow-2xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">Direct Upload:</span>
                        <span className="text-slate-500">Click anywhere on the preview image above to upload</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">Optimal Aspect:</span>
                        <span className="font-mono text-[#1540a8] font-bold">1200 × 500 px</span>
                        <span className="text-slate-500">(Auto-optimized)</span>
                      </div>
                    </div>

                    {/* Inline Dimension / Size Error Text */}
                    {bannerError && (
                      <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs px-3.5 py-2.5 font-medium flex items-start gap-2.5 animate-in fade-in">
                        <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <span className="font-bold">Image Error: </span>
                          {bannerError}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <button
                        type="button"
                        onClick={() => bannerFileInputRef.current?.click()}
                        className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg bg-white border border-stone-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs shrink-0"
                      >
                        <Camera className="h-4 w-4 text-[#1540a8]" />
                        <span>Upload Banner File</span>
                      </button>

                      <div className="flex-1 flex items-center">
                        <input
                          type="text"
                          value={bannerInputUrl.startsWith('data:') ? '' : bannerInputUrl}
                          onChange={(e) => {
                            setBannerInputUrl(e.target.value);
                            setBannerPreview(e.target.value.trim() || null);
                            if (bannerError) setBannerError(null);
                          }}
                          placeholder={bannerInputUrl.startsWith('data:') ? 'Local image selected for upload' : 'Or paste direct image URL (https://…)'}
                          className="w-full rounded-lg bg-white border border-stone-300 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1540a8]"
                        />
                      </div>

                      <button
                        onClick={() => handleSaveBanner()}
                        disabled={savingBanner || (!bannerInputUrl && !bannerPreview) || !!bannerError}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#1540a8] hover:bg-[#07174a] text-white px-5 py-2 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shrink-0"
                      >
                        {savingBanner ? (
                          <span>Saving…</span>
                        ) : (
                          <>
                            <Upload className="h-3.5 w-3.5" />
                            <span>Save Banner</span>
                          </>
                        )}
                      </button>

                      {(myBusiness.bannerUrl || (myBusiness.workPhotos && myBusiness.workPhotos.length > 0)) && (
                        <button
                          onClick={handleResetToFallback}
                          disabled={savingBanner}
                          className="inline-flex items-center justify-center gap-1 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 px-3 py-2 text-xs font-bold transition-colors cursor-pointer shrink-0"
                          title="Clear custom banner and revert to industry fallback"
                        >
                          <RefreshCw className="h-3 w-3" />
                          <span>Reset to Industry Image</span>
                        </button>
                      )}
                    </div>

                    {bannerSuccess && (
                      <div className="rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-2 font-medium flex items-center gap-2 animate-in fade-in">
                        <Check className="h-4 w-4 text-emerald-600" />
                        <span>Enterprise banner updated successfully! It will now be shown across directory and homepage.</span>
                      </div>
                    )}
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
              <div className="rounded-2xl border-2 border-dashed border-stone-300 bg-white p-10 sm:p-14 text-center max-w-xl mx-auto shadow-xs">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mx-auto mb-4 border border-amber-200">
                  <Building2 className="h-7 w-7" />
                </div>
                <h3 className="font-serif-heading text-xl font-bold text-[#07174a]">
                  Register Your Enterprise
                </h3>
                <p className="text-xs text-slate-500 mt-2 mb-6 max-w-md mx-auto leading-relaxed">
                  You haven&apos;t registered your business listing yet. Enrol your firm, showroom, manufacturing unit, or professional agency to get verified and published on the ACCI Jabalpur Portal.
                </p>
                <Link
                  href="/membership"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#07174a] hover:bg-[#1540a8] px-6 py-3 text-xs font-bold text-white transition-all shadow-md hover:scale-105"
                >
                  <Building2 className="h-4 w-4 text-amber-400" />
                  <span>Enrol Enterprise Listing Now — Free</span>
                  <ArrowRight className="h-4 w-4" />
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
