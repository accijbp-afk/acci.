'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/appwrite/auth';
import { membersService } from '@/services/appwrite/members';
import { eventsService } from '@/services/appwrite/events';
import { galleryService } from '@/services/appwrite/gallery';
import { newsService } from '@/services/appwrite/news';
import { jobsService } from '@/services/appwrite/jobs';
import { inquiriesService } from '@/services/appwrite/inquiries';
import {
  UserProfile,
  MemberBusiness,
  ChamberEvent,
  GalleryAlbum,
  ChamberNews,
  JobListing,
  ContactSubmission,
  BusinessReview,
  LegalDocument,
} from '@/types';
import {
  ShieldCheck,
  Building2,
  Users,
  Calendar,
  Images,
  Newspaper,
  Briefcase,
  Mail,
  Star,
  CheckCircle,
  XCircle,
  PlusCircle,
  Trash2,
  RefreshCw,
  LogOut,
  ExternalLink,
  Search,
  Eye,
  FileText,
  Save,
  RotateCcw,
  Check,
  Edit3,
  X,
} from 'lucide-react';
import { legalService } from '@/services/appwrite/legal';
import { notificationService } from '@/services/notifications';
import { LegalContentRenderer } from '@/components/common/LegalContentRenderer';

export default function AdminDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'vendors' | 'accounts' | 'events' | 'gallery' | 'news' | 'jobs' | 'inquiries' | 'reviews' | 'legal'
  >('overview');

  // Data states
  const [vendors, setVendors] = useState<MemberBusiness[]>([]);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [events, setEvents] = useState<ChamberEvent[]>([]);
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [news, setNews] = useState<ChamberNews[]>([]);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [inquiries, setInquiries] = useState<ContactSubmission[]>([]);
  const [reviews, setReviews] = useState<BusinessReview[]>([]);
  const [loading, setLoading] = useState(true);

  // Legal Policies State
  const [activeLegalDoc, setActiveLegalDoc] = useState<'terms' | 'privacy'>('terms');
  const [legalDoc, setLegalDoc] = useState<LegalDocument>(() => legalService.getDefaults('terms'));
  const [legalLoading, setLegalLoading] = useState(false);
  const [legalSaving, setLegalSaving] = useState(false);
  const [legalSaveSuccess, setLegalSaveSuccess] = useState(false);

  // Member Profile Editing State
  const [editingMember, setEditingMember] = useState<MemberBusiness | null>(null);
  const [editMemberForm, setEditMemberForm] = useState<Partial<MemberBusiness>>({});
  const [savingMember, setSavingMember] = useState(false);
  const [editMemberSuccess, setEditMemberSuccess] = useState(false);

  // New Event Form State
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'Business Networking',
    date: '2026-11-15',
    time: '04:00 PM',
    venue: 'Hotel Satkar, Jabalpur',
    description: '',
  });

  // Gallery Album Form State
  const [showAddAlbumModal, setShowAddAlbumModal] = useState(false);
  const [newAlbum, setNewAlbum] = useState({
    title: '',
    category: 'Trade Summit',
    date: '18 Oct 2026',
    venue: 'Hotel Satkar Grand, Jabalpur',
    coverUrl: '',
    description: '',
    photosText: '',
  });
  const [previewAlbum, setPreviewAlbum] = useState<GalleryAlbum | null>(null);

  // New News Form State
  const [showAddNewsModal, setShowAddNewsModal] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: '',
    category: 'Chamber Circular',
    excerpt: '',
    content: '',
    author: 'Secretariat, ACCI Jabalpur',
  });

  const loadAllData = async () => {
    setLoading(true);
    const [vRes, evRes, nRes, jRes, inqRes, revRes, galRes, uList] = await Promise.all([
      membersService.getMembers({ status: 'all' }),
      eventsService.getEvents(),
      newsService.getNews(),
      jobsService.getJobs(),
      inquiriesService.getInquiries(),
      membersService.getAllReviewsAdmin(),
      galleryService.getAlbums(),
      authService.getUsers(),
    ]);

    setVendors(vRes.members);
    setEvents(evRes);
    setNews(nRes);
    setJobs(jRes);
    setInquiries(inqRes);
    setReviews(revRes);
    setAlbums(galRes);
    setUsersList(uList || []);
    try {
      const lDoc = await legalService.getLegalContent(activeLegalDoc);
      setLegalDoc(lDoc);
    } catch {
      // Fallback already provided in state
    }
    setLoading(false);
  };

  useEffect(() => {
    authService.getCurrentUser().then((u) => {
      if (!u || u.role !== 'admin') {
        // For testing convenience, if not admin, allow view or redirect
        if (!u) {
          router.push('/login');
          return;
        }
      }
      setCurrentUser(u);
      loadAllData();
    });
  }, [router]);

  const handleVendorStatus = async (id: string, status: 'approved' | 'rejected') => {
    const target = vendors.find((v) => v.id === id || v.$id === id);
    await membersService.updateMemberStatus(id, status);

    // Notify Member if email exists
    if (target?.email) {
      if (status === 'approved') {
        notificationService.notifyMember(target.email, {
          event: 'ACCOUNT_VERIFIED',
          title: `Account Verified & Approved: ${target.businessName}`,
          subtitle: `Congratulations! Your enterprise profile has been verified and officially published in the ACCI Chamber Directory.`,
          details: [
            { label: 'Enterprise Name', value: target.businessName },
            { label: 'Proprietor', value: target.ownerName },
            { label: 'Category', value: target.category },
            { label: 'Verification Status', value: 'Active & Verified' },
          ],
          actionText: 'View Directory Listing',
          actionUrl: '/directory',
        });
      } else {
        notificationService.notifyMember(target.email, {
          event: 'ACCOUNT_REJECTED',
          title: `Chamber Application Update: ${target.businessName}`,
          subtitle: `Your enterprise registration has been marked as rejected or requires revisions by the Secretariat.`,
          details: [
            { label: 'Enterprise Name', value: target.businessName },
            { label: 'Status', value: 'Application Declined' },
            { label: 'Action Required', value: 'Please contact Secretariat Helpdesk to rectify documentation.' },
          ],
          actionText: 'Contact Secretariat',
          actionUrl: '/contact',
        });
      }
    }

    // Notify Admin inbox
    notificationService.notifyAdmin({
      event: 'MEMBER_STATUS_CHANGED',
      title: `Member Status Updated: ${target?.businessName || id} -> ${status.toUpperCase()}`,
      subtitle: `Secretariat action executed for ${target?.businessName || id}.`,
      details: [
        { label: 'Enterprise', value: target?.businessName || id },
        { label: 'New Status', value: status.toUpperCase() },
        { label: 'Owner', value: target?.ownerName || '—' },
        { label: 'Phone', value: target?.phone || '—' },
      ],
      actionUrl: '/admin',
    });

    loadAllData();
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    const target = vendors.find((v) => v.id === id || v.$id === id);
    const nextFeatured = !current;
    await membersService.toggleFeatured(id, nextFeatured);

    if (nextFeatured && target?.email) {
      notificationService.notifyMember(target.email, {
        event: 'PROFILE_FEATURED',
        title: `Congratulations! ${target.businessName} is now Featured!`,
        subtitle: `Your enterprise has been selected for Chamber Spotlight on the ACCI Jabalpur homepage & featured directory showcase.`,
        details: [
          { label: 'Business Name', value: target.businessName },
          { label: 'Spotlight Placement', value: 'Homepage & Chamber Directory' },
          { label: 'Classification', value: target.category },
        ],
        actionText: 'View Featured Listing',
        actionUrl: '/',
      });
    }

    loadAllData();
  };

  const handleStartEditMember = (member: MemberBusiness) => {
    setEditingMember(member);
    setEditMemberForm({
      businessName: member.businessName,
      legalName: member.legalName || member.businessName,
      ownerName: member.ownerName,
      category: member.category,
      industry: member.industry,
      email: member.email || '',
      phone: member.phone,
      whatsapp: member.whatsapp || member.phone,
      address: member.address,
      city: member.city || 'Jabalpur',
      pinCode: member.pinCode || '482001',
      website: member.website || '',
      gst: member.gst || '',
      estYear: member.estYear || '2015',
      employees: member.employees || '5',
      description: member.description || '',
      detailed: member.detailed || '',
      status: member.status,
      featured: Boolean(member.featured),
      plan: member.plan || 'Free',
    });
    setEditMemberSuccess(false);
  };

  const handleSaveEditMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    setSavingMember(true);

    try {
      await membersService.updateMember(editingMember.id, editMemberForm);

      // Notify Member if email is provided
      const memberEmail = editMemberForm.email || editingMember.email;
      if (memberEmail) {
        notificationService.notifyMember(memberEmail, {
          event: 'PROFILE_UPDATED',
          title: `Chamber Profile Updated: ${editMemberForm.businessName || editingMember.businessName}`,
          subtitle: `Your business profile details were updated by the ACCI Secretariat.`,
          details: [
            { label: 'Enterprise Name', value: editMemberForm.businessName || editingMember.businessName },
            { label: 'Category', value: editMemberForm.category || editingMember.category },
            { label: 'Contact Phone', value: editMemberForm.phone || editingMember.phone },
            { label: 'Status', value: (editMemberForm.status || editingMember.status).toUpperCase() },
          ],
          actionText: 'View Chamber Directory',
          actionUrl: '/directory',
        });
      }

      // Notify Admin
      notificationService.notifyAdmin({
        event: 'MEMBER_PROFILE_EDITED',
        title: `Admin Edited Member: ${editMemberForm.businessName || editingMember.businessName}`,
        subtitle: `Administrator modified details for member enterprise ${editingMember.id}.`,
        details: [
          { label: 'Business Name', value: editMemberForm.businessName || editingMember.businessName },
          { label: 'Proprietor', value: editMemberForm.ownerName || editingMember.ownerName },
          { label: 'Status', value: (editMemberForm.status || editingMember.status).toUpperCase() },
          { label: 'Member ID', value: editingMember.id },
        ],
        actionUrl: '/admin',
      });

      setEditMemberSuccess(true);
      setTimeout(() => {
        setEditingMember(null);
        setEditMemberSuccess(false);
        loadAllData();
      }, 1200);
    } catch (err) {
      console.error('Save member edit error:', err);
      alert('Failed to save member profile changes.');
    } finally {
      setSavingMember(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    await eventsService.createEvent({
      ...newEvent,
      slug: newEvent.title.toLowerCase().replace(/\s+/g, '-'),
    });
    setShowAddEventModal(false);
    setNewEvent({
      title: '',
      category: 'Business Networking',
      date: '2026-11-15',
      time: '04:00 PM',
      venue: 'Hotel Satkar, Jabalpur',
      description: '',
    });
    loadAllData();
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm('Delete this event?')) {
      await eventsService.deleteEvent(id);
      loadAllData();
    }
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    const photos = newAlbum.photosText
      ? newAlbum.photosText
          .split(/[\n,]+/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [newAlbum.coverUrl];

    await galleryService.createAlbum({
      title: newAlbum.title,
      category: newAlbum.category,
      date: newAlbum.date || '2026',
      venue: newAlbum.venue,
      coverUrl: newAlbum.coverUrl,
      description: newAlbum.description,
      photos: photos.length > 0 ? photos : [newAlbum.coverUrl],
    });

    setShowAddAlbumModal(false);
    setNewAlbum({
      title: '',
      category: 'Trade Summit',
      date: '18 Oct 2026',
      venue: 'Hotel Satkar Grand, Jabalpur',
      coverUrl: '',
      description: '',
      photosText: '',
    });
    loadAllData();
  };

  const handleDeleteAlbum = async (id: string) => {
    if (confirm('Delete this concluded event album from gallery?')) {
      await galleryService.deleteAlbum(id);
      loadAllData();
    }
  };

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    await newsService.createNews({
      ...newArticle,
      slug: newArticle.title.toLowerCase().replace(/\s+/g, '-'),
      status: 'published',
    });
    setShowAddNewsModal(false);
    setNewArticle({
      title: '',
      category: 'Chamber Circular',
      excerpt: '',
      content: '',
      author: 'Secretariat, ACCI Jabalpur',
    });
    loadAllData();
  };

  const handleDeleteNews = async (id: string) => {
    if (confirm('Delete this circular?')) {
      await newsService.deleteNews(id);
      loadAllData();
    }
  };

  const handleReviewStatus = async (id: string, status: 'approved' | 'pending') => {
    await membersService.updateReviewStatus(id, status);
    loadAllData();
  };

  const handleSwitchLegalDoc = async (type: 'terms' | 'privacy') => {
    setActiveLegalDoc(type);
    setLegalLoading(true);
    setLegalSaveSuccess(false);
    try {
      const data = await legalService.getLegalContent(type);
      setLegalDoc(data);
    } catch {
      // Keep existing or default
    } finally {
      setLegalLoading(false);
    }
  };

  const handleSaveLegal = async () => {
    setLegalSaving(true);
    try {
      const saved = await legalService.updateLegalContent(activeLegalDoc, legalDoc);
      setLegalDoc(saved);
      setLegalSaveSuccess(true);
      setTimeout(() => setLegalSaveSuccess(false), 4000);
    } catch (e) {
      console.error('Error saving legal policy', e);
      alert('Failed to save policy changes. Please try again.');
    } finally {
      setLegalSaving(false);
    }
  };

  const handleResetLegal = async () => {
    const docName = activeLegalDoc === 'terms' ? 'Terms & Conditions' : 'Privacy Policy';
    if (confirm(`Are you sure you want to restore the official default ACCI template for ${docName}?`)) {
      setLegalSaving(true);
      try {
        const res = await legalService.resetLegalContent(activeLegalDoc);
        setLegalDoc(res);
        setLegalSaveSuccess(true);
        setTimeout(() => setLegalSaveSuccess(false), 3000);
      } catch (e) {
        console.error('Error resetting policy', e);
      } finally {
        setLegalSaving(false);
      }
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    router.push('/');
  };

  if (loading && !currentUser) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#1540a8] border-r-transparent" />
        <p className="mt-3 text-xs text-slate-500">Checking Chamber Credentials…</p>
      </div>
    );
  }

  return (
    <div className="bg-[#faf8f5] min-h-screen pb-20">
      {/* Admin Top Banner */}
      <div className="bg-[#07174a] text-white border-b-4 border-amber-400 py-6 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-white shadow-md">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif-heading text-xl sm:text-2xl font-bold text-white">
                  ACCI Secretariat Control Panel
                </h1>
                <span className="rounded bg-red-600/80 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-white">
                  Superadmin
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Agrawal Chamber of Commerce & Industries • Jabalpur
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllData}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Refresh Data</span>
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-400/40 bg-red-900/40 px-3 py-1.5 text-xs font-semibold text-red-200 hover:bg-red-900/60 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-bar */}
      <div className="bg-white border-b border-slate-200 sticky top-[65px] z-20 shadow-xs">
        <div className="mx-auto max-w-7xl flex items-center gap-1 overflow-x-auto px-4 sm:px-6 py-2">
          {[
            { id: 'overview', label: 'Overview', icon: Building2 },
            { id: 'vendors', label: `Enterprises (${vendors.length})`, icon: Building2 },
            { id: 'accounts', label: `User Accounts (${usersList.length})`, icon: Users },
            { id: 'events', label: `Events (${events.length})`, icon: Calendar },
            { id: 'gallery', label: `Gallery (${albums.length})`, icon: Images },
            { id: 'news', label: `Circulars (${news.length})`, icon: Newspaper },
            { id: 'jobs', label: `Jobs (${jobs.length})`, icon: Briefcase },
            { id: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: Mail },
            { id: 'reviews', label: `Reviews (${reviews.length})`, icon: Star },
            { id: 'legal', label: 'Legal Policies', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-[#07174a] text-white shadow'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Admin Tab View */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-8">
        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                  Total Member Businesses
                </span>
                <div className="font-serif-heading text-3xl font-extrabold text-[#07174a] mt-2">
                  {vendors.length}
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                  {vendors.filter((v) => v.status === 'approved').length} Active & Approved
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                  Pending Approvals
                </span>
                <div className="font-serif-heading text-3xl font-extrabold text-amber-600 mt-2">
                  {vendors.filter((v) => v.status === 'pending').length}
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Awaiting secretariat verification
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                  Chamber Events
                </span>
                <div className="font-serif-heading text-3xl font-extrabold text-[#1540a8] mt-2">
                  {events.length}
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Upcoming conclaves & meetings
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                  Public Inquiries
                </span>
                <div className="font-serif-heading text-3xl font-extrabold text-purple-700 mt-2">
                  {inquiries.length}
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Delivered to secretariat inbox
                </span>
              </div>
            </div>

            {/* Recent Enrolments Table */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-serif-heading text-lg font-bold text-[#07174a] mb-4">
                Recent Business Applications
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">Business Name</th>
                      <th className="p-3">Founder / Owner</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Industry</th>
                      <th className="p-3">Contact Phone</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {vendors.slice(0, 5).map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-[#07174a]">{v.businessName}</td>
                        <td className="p-3">{v.ownerName}</td>
                        <td className="p-3">{v.category}</td>
                        <td className="p-3 text-slate-500">{v.industry}</td>
                        <td className="p-3 font-mono">{v.phone}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              v.status === 'approved'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {v.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setActiveTab('vendors')}
                            className="text-blue-700 font-bold hover:underline"
                          >
                            Manage →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VENDORS / ENTERPRISES */}
        {activeTab === 'vendors' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-serif-heading text-lg font-bold text-[#07174a]">
                  Enterprise Moderation & Approvals
                </h2>
                <p className="text-xs text-slate-500">
                  Approve new vendor listings, feature top enterprises, or edit status.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">Business</th>
                    <th className="p-3">Proprietor</th>
                    <th className="p-3">Classification</th>
                    <th className="p-3">Address</th>
                    <th className="p-3">GST</th>
                    <th className="p-3">Featured</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vendors.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        <div className="font-bold text-[#07174a]">{v.businessName}</div>
                        <div className="text-[11px] text-slate-400">{v.phone}</div>
                      </td>
                      <td className="p-3">{v.ownerName}</td>
                      <td className="p-3">
                        <span className="text-slate-800 font-medium block">{v.category}</span>
                        <span className="text-[11px] text-slate-500">{v.industry}</span>
                      </td>
                      <td className="p-3 text-slate-500 max-w-[150px] truncate">{v.address}</td>
                      <td className="p-3 font-mono text-[11px]">{v.gst || '—'}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleFeatured(v.id, v.featured)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                            v.featured
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {v.featured ? '⭐ Featured' : 'Standard'}
                        </button>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            v.status === 'approved'
                              ? 'bg-emerald-50 text-emerald-700'
                              : v.status === 'rejected'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {v.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => handleStartEditMember(v)}
                          className="rounded bg-[#07174a] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#1540a8] cursor-pointer inline-flex items-center gap-1 shadow-xs"
                          title="Edit full member profile"
                        >
                          <Edit3 className="h-3 w-3" />
                          <span>Edit</span>
                        </button>
                        {v.status !== 'approved' && (
                          <button
                            onClick={() => handleVendorStatus(v.id, 'approved')}
                            className="rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                        {v.status !== 'rejected' && (
                          <button
                            onClick={() => handleVendorStatus(v.id, 'rejected')}
                            className="rounded bg-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-red-600 hover:text-white cursor-pointer"
                          >
                            Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: REGISTERED USER ACCOUNTS */}
        {activeTab === 'accounts' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-serif-heading text-lg font-bold text-[#07174a]">
                  Registered Member &amp; User Accounts ({usersList.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Individual accounts created through Member Sign Up / Portal Registration.
                </p>
              </div>
            </div>

            {usersList.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No user accounts registered yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">Member Name</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">City</th>
                      <th className="p-3">Account Role</th>
                      <th className="p-3">Registered On</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usersList.map((u, idx) => (
                      <tr key={u.userId || idx} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-[#07174a]">{u.name}</td>
                        <td className="p-3 font-medium text-slate-800">{u.email}</td>
                        <td className="p-3 font-mono text-slate-600">{u.phone || '—'}</td>
                        <td className="p-3 text-slate-600">{u.city || 'Jabalpur'}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              u.role === 'admin'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400 font-mono text-[11px]">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                        </td>
                        <td className="p-3 text-right">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                            <CheckCircle className="h-3 w-3" />
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {activeTab === 'events' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div>
                <h2 className="font-serif-heading text-lg font-bold text-[#07174a]">
                  Chamber Events Management
                </h2>
                <p className="text-xs text-slate-500">Publish conclaves, symposiums, and delegate passes.</p>
              </div>
              <button
                onClick={() => setShowAddEventModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1540a8] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#07174a] cursor-pointer"
              >
                <PlusCircle className="h-4 w-4" />
                <span>+ Add Chamber Event</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((ev) => (
                <div key={ev.id} className="rounded-xl border border-slate-200 p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                      {ev.category}
                    </span>
                    <h3 className="font-serif-heading text-base font-bold text-[#07174a] mt-2">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">📅 {ev.date} • 📍 {ev.venue}</p>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2">{ev.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => handleDeleteEvent(ev.id)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-800 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: GALLERY & EVENT PHOTO ARCHIVES */}
        {activeTab === 'gallery' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 mb-6 gap-3">
              <div>
                <h2 className="font-serif-heading text-lg font-bold text-[#07174a]">
                  Concluded Events &amp; Photo Gallery
                </h2>
                <p className="text-xs text-slate-500">
                  Manage photo albums and concluded event photo archives displayed on the public gallery page.
                </p>
              </div>
              <button
                onClick={() => setShowAddAlbumModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1540a8] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#07174a] cursor-pointer shrink-0"
              >
                <PlusCircle className="h-4 w-4" />
                <span>+ Add Concluded Event Album</span>
              </button>
            </div>

            {albums.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">
                No event albums created yet. Click above to add your first concluded event album.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {albums.map((album) => (
                  <div
                    key={album.id}
                    className="rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
                  >
                    <div className="p-5 flex gap-4">
                      <div className="relative h-24 w-28 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={album.coverUrl}
                          alt={album.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute bottom-1 right-1 rounded bg-black/75 px-1.5 py-0.5 text-[9px] font-bold text-white">
                          {album.photos?.length || album.photoCount || 1} photos
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                            {album.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {album.date}
                          </span>
                        </div>
                        <h3 className="font-serif-heading font-bold text-sm text-[#07174a] line-clamp-1">
                          {album.title}
                        </h3>
                        {album.venue && (
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            📍 {album.venue}
                          </p>
                        )}
                        <p className="text-xs text-slate-600 line-clamp-2 mt-1.5">
                          {album.description}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => setPreviewAlbum(album)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1540a8] hover:text-[#07174a] cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Photos ({album.photos?.length || album.photoCount || 1})</span>
                      </button>
                      <button
                        onClick={() => handleDeleteAlbum(album.id)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: NEWS & CIRCULARS */}
        {activeTab === 'news' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div>
                <h2 className="font-serif-heading text-lg font-bold text-[#07174a]">
                  Chamber Trade Circulars & News
                </h2>
                <p className="text-xs text-slate-500">Publish taxation advisories, gazettes, and press releases.</p>
              </div>
              <button
                onClick={() => setShowAddNewsModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1540a8] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#07174a] cursor-pointer"
              >
                <PlusCircle className="h-4 w-4" />
                <span>+ Publish Circular</span>
              </button>
            </div>

            <div className="space-y-4">
              {news.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 p-5 flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                      {item.category}
                    </span>
                    <h3 className="font-serif-heading text-base font-bold text-[#07174a] mt-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Published: {item.publishedAt} by {item.author}</p>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2">{item.excerpt}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteNews(item.id)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-800 shrink-0 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: JOBS MODERATION */}
        {activeTab === 'jobs' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-serif-heading text-lg font-bold text-[#07174a] mb-1">
              Community Job Postings
            </h2>
            <p className="text-xs text-slate-500 mb-6">Manage active employment vacancies across member firms.</p>

            <div className="space-y-3">
              {jobs.map((j) => (
                <div key={j.id} className="rounded-xl border border-slate-200 p-4 text-xs flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-[#07174a] text-sm">{j.title}</h3>
                    <span className="text-slate-500">{j.company} • 📍 {j.location} • 💰 {j.salary}</span>
                  </div>
                  <span className="rounded bg-emerald-50 text-emerald-700 px-2 py-0.5 font-bold border border-emerald-200">
                    {j.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: INQUIRIES INBOX */}
        {activeTab === 'inquiries' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-serif-heading text-lg font-bold text-[#07174a] mb-1">
              Secretariat Inquiries Inbox
            </h2>
            <p className="text-xs text-slate-500 mb-6">Messages received from the contact page and partnership requests.</p>

            {inquiries.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No inquiries received yet.</p>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="rounded-xl border border-slate-200 p-5 text-xs bg-slate-50/50">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                      <div>
                        <strong className="text-[#07174a] text-sm">{inq.name}</strong>
                        <span className="text-slate-500 ml-2 font-mono">{inq.phone} • {inq.email}</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="font-bold text-slate-700 mb-1">Subject: {inq.subject}</div>
                    <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{inq.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-serif-heading text-lg font-bold text-[#07174a] mb-1">
              Customer & Vendor Reviews Moderation
            </h2>
            <p className="text-xs text-slate-500 mb-6">Approve genuine customer reviews before they appear on public business cards.</p>

            <div className="space-y-3">
              {reviews.map((rev) => (
                <div key={rev.id} className="rounded-xl border border-slate-200 p-4 text-xs flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-800">{rev.reviewerName}</strong>
                      <span className="text-amber-500">{'★'.repeat(rev.rating)}</span>
                      <span className="text-slate-400">for {rev.businessName}</span>
                    </div>
                    <p className="text-slate-600 mt-1">{rev.reviewText}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        rev.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {rev.status}
                    </span>
                    {rev.status !== 'approved' ? (
                      <button
                        onClick={() => handleReviewStatus(rev.id, 'approved')}
                        className="rounded bg-emerald-600 px-2 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 cursor-pointer"
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReviewStatus(rev.id, 'pending')}
                        className="rounded bg-slate-200 px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-300 cursor-pointer"
                      >
                        Unapprove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: LEGAL & POLICIES */}
        {activeTab === 'legal' && (
          <div className="space-y-6">
            {/* Top document selector & actions */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif-heading text-xl font-bold text-[#07174a]">
                      Legal Governance &amp; Policy Management
                    </h2>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                      Live Editable
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Edit official Chamber Terms &amp; Conditions and Privacy Policy directly. Changes update the public pages instantly.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={activeLegalDoc === 'terms' ? '/terms' : '/privacy'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>View Public Page</span>
                  </a>

                  <button
                    onClick={handleResetLegal}
                    disabled={legalSaving}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100 cursor-pointer disabled:opacity-50"
                    title="Restore the official default template"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset to ACCI Default</span>
                  </button>

                  <button
                    onClick={handleSaveLegal}
                    disabled={legalSaving}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#1540a8] hover:bg-[#07174a] text-white px-5 py-2 text-xs font-bold transition shadow cursor-pointer disabled:opacity-50"
                  >
                    {legalSaving ? (
                      <>
                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-r-transparent" />
                        <span>Saving…</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-3.5 w-3.5" />
                        <span>Save &amp; Publish</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Policy document switch buttons */}
              <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => handleSwitchLegalDoc('terms')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
                    activeLegalDoc === 'terms'
                      ? 'bg-[#07174a] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>Terms &amp; Conditions</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSwitchLegalDoc('privacy')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
                    activeLegalDoc === 'privacy'
                      ? 'bg-[#07174a] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>Privacy Policy</span>
                </button>
              </div>
            </div>

            {/* Success notification banner */}
            {legalSaveSuccess && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-900 flex items-center gap-2 animate-in fade-in">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  Successfully updated {activeLegalDoc === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}! The changes are now live on the public page.
                </span>
              </div>
            )}

            {/* Editor & Live Preview Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Form & Editor */}
              <div className="lg:col-span-7 space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Document Title *
                      </label>
                      <input
                        type="text"
                        value={legalDoc.title}
                        onChange={(e) => setLegalDoc({ ...legalDoc, title: e.target.value })}
                        placeholder="e.g. Terms & Conditions of Chamber Affiliation"
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Category / Topic Badge
                      </label>
                      <input
                        type="text"
                        value={legalDoc.categoryBadge}
                        onChange={(e) => setLegalDoc({ ...legalDoc, categoryBadge: e.target.value })}
                        placeholder="e.g. Legal Governance & Bylaws"
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Last Updated Display
                    </label>
                    <input
                      type="text"
                      value={legalDoc.lastUpdated || ''}
                      onChange={(e) => setLegalDoc({ ...legalDoc, lastUpdated: e.target.value })}
                      placeholder="e.g. September 2026"
                      className="w-full sm:w-1/2 rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                    />
                  </div>

                  {/* Formatting Toolbar */}
                  <div className="border-t border-slate-100 pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-semibold text-slate-700">
                        Document Content *
                      </label>
                      <span className="text-[11px] text-slate-400">
                        Supports Headings (##), Bullet Lists (-), Bold (**text**)
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 mb-2 bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs">
                      <span className="text-[11px] text-slate-500 font-medium mr-1">Quick insert:</span>
                      <button
                        type="button"
                        onClick={() =>
                          setLegalDoc({
                            ...legalDoc,
                            content: legalDoc.content + '\n\n## New Section Heading\nWrite your section clauses here…\n',
                          })
                        }
                        className="rounded bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 border border-slate-200 hover:bg-slate-100 cursor-pointer"
                      >
                        + Section (##)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setLegalDoc({
                            ...legalDoc,
                            content: legalDoc.content + '\n- First clause item\n- Second clause item\n',
                          })
                        }
                        className="rounded bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 border border-slate-200 hover:bg-slate-100 cursor-pointer"
                      >
                        + Bullet List (-)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setLegalDoc({
                            ...legalDoc,
                            content: legalDoc.content + ' **important clause** ',
                          })
                        }
                        className="rounded bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 border border-slate-200 hover:bg-slate-100 cursor-pointer"
                      >
                        + Bold (**text**)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setLegalDoc({
                            ...legalDoc,
                            content: legalDoc.content + '\n\n## Secretariat Contact & Legal Notices\nFor official notices, write to: accijbp@gmail.com or visit Civic Centre, Jabalpur.\n',
                          })
                        }
                        className="rounded bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 border border-slate-200 hover:bg-slate-100 cursor-pointer"
                      >
                        + Contact Notice
                      </button>
                    </div>

                    <textarea
                      rows={18}
                      value={legalDoc.content}
                      onChange={(e) => setLegalDoc({ ...legalDoc, content: e.target.value })}
                      placeholder="Write policy clauses, terms of service, governance bylaws, data protection rules…"
                      className="w-full rounded-xl border border-slate-300 p-3.5 text-xs text-slate-800 font-mono leading-relaxed focus:outline-none focus:border-[#1540a8] shadow-inner"
                    />

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                      <span>{legalDoc.content.length} characters</span>
                      <span>Auto-renders live preview on the right</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveLegal}
                      disabled={legalSaving}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#1540a8] hover:bg-[#07174a] text-white px-6 py-2.5 text-xs font-bold transition shadow cursor-pointer disabled:opacity-50"
                    >
                      {legalSaving ? 'Saving…' : 'Save & Publish Changes'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Formatted Public Preview */}
              <div className="lg:col-span-5 sticky top-[130px]">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm max-h-[80vh] flex flex-col">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4 shrink-0">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-[#1540a8]" />
                      <h3 className="font-serif-heading text-sm font-bold text-[#07174a]">
                        Live Public Preview
                      </h3>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      As seen on {activeLegalDoc === 'terms' ? '/terms' : '/privacy'}
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2">
                    <div className="rounded-xl border border-slate-200 bg-[#faf8f5] p-5 shadow-xs">
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#1540a8] bg-blue-50 px-2 py-0.5 rounded">
                          {legalDoc.categoryBadge || 'Legal'}
                        </span>
                        {legalDoc.lastUpdated && (
                          <span className="text-[10px] text-slate-400">
                            Updated: {legalDoc.lastUpdated}
                          </span>
                        )}
                      </div>

                      <h2 className="font-serif-heading text-lg font-bold text-[#07174a] pb-2 border-b border-slate-200 mb-4">
                        {legalDoc.title || 'Untitled Policy'}
                      </h2>

                      <LegalContentRenderer content={legalDoc.content} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Add Event */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <button
              onClick={() => setShowAddEventModal(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100"
            >
              ✕
            </button>
            <h3 className="font-serif-heading text-xl font-bold text-[#07174a]">
              Add New Chamber Event
            </h3>
            <form onSubmit={handleCreateEvent} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="e.g. ACCI Annual Business Conclave 2026"
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800"
                  >
                    <option value="Business Networking">Business Networking</option>
                    <option value="Seminar">Seminar / Workshop</option>
                    <option value="Cultural & Trade">Cultural & Trade</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    placeholder="04:00 PM"
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Venue</label>
                  <input
                    type="text"
                    value={newEvent.venue}
                    onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                    placeholder="Civic Centre, Jabalpur"
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Event agenda, keynote addresses, delegate requirements…"
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-[#1540a8] py-2.5 text-xs font-bold text-white hover:bg-[#07174a]"
              >
                Publish Event
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add News */}
      {showAddNewsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <button
              onClick={() => setShowAddNewsModal(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100"
            >
              ✕
            </button>
            <h3 className="font-serif-heading text-xl font-bold text-[#07174a]">
              Publish Chamber Circular
            </h3>
            <form onSubmit={handleCreateNews} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  placeholder="e.g. Revised MSME Vendor Payment Guidelines"
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={newArticle.category}
                  onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800"
                >
                  <option value="Chamber Circular">Chamber Circular</option>
                  <option value="Trade Advisory">Trade Advisory</option>
                  <option value="Community Achievement">Community Achievement</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Excerpt *</label>
                <input
                  type="text"
                  required
                  value={newArticle.excerpt}
                  onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                  placeholder="1-2 sentences summary…"
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Content *</label>
                <textarea
                  required
                  rows={5}
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                  placeholder="Full circular text, guidelines, notifications…"
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-[#1540a8] py-2.5 text-xs font-bold text-white hover:bg-[#07174a]"
              >
                Publish Official Circular
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Concluded Event Gallery Album */}
      {showAddAlbumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddAlbumModal(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 cursor-pointer"
            >
              ✕
            </button>
            <h3 className="font-serif-heading text-xl font-bold text-[#07174a]">
              Add Concluded Event to Gallery
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Create a dedicated photo gallery section for this concluded event.
            </p>

            <form onSubmit={handleCreateAlbum} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={newAlbum.title}
                  onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
                  placeholder="e.g. Annual Agrawal MSME Industrial Summit"
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newAlbum.category}
                    onChange={(e) => setNewAlbum({ ...newAlbum, category: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800"
                  >
                    <option value="Trade Summit">Trade Summit</option>
                    <option value="Cultural & Trade">Cultural &amp; Trade</option>
                    <option value="Policy Delegation">Policy Delegation</option>
                    <option value="Youth Wing">Youth Wing</option>
                    <option value="Exhibition & Expo">Exhibition &amp; Expo</option>
                    <option value="Award Ceremony">Award Ceremony</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Event Date</label>
                  <input
                    type="text"
                    value={newAlbum.date}
                    onChange={(e) => setNewAlbum({ ...newAlbum, date: e.target.value })}
                    placeholder="e.g. 18 Oct 2026"
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Venue</label>
                <input
                  type="text"
                  value={newAlbum.venue}
                  onChange={(e) => setNewAlbum({ ...newAlbum, venue: e.target.value })}
                  placeholder="e.g. Hotel Satkar Grand, Jabalpur"
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cover Image URL *</label>
                <input
                  type="url"
                  required
                  value={newAlbum.coverUrl}
                  onChange={(e) => setNewAlbum({ ...newAlbum, coverUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/... or /images/..."
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={newAlbum.description}
                  onChange={(e) => setNewAlbum({ ...newAlbum, description: e.target.value })}
                  placeholder="Summary of what happened at this event, key dignitaries present, announcements made…"
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Event Photo URLs (one per line or comma separated)
                </label>
                <textarea
                  rows={4}
                  value={newAlbum.photosText}
                  onChange={(e) => setNewAlbum({ ...newAlbum, photosText: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-1&#10;https://images.unsplash.com/photo-2&#10;https://images.unsplash.com/photo-3"
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 font-mono"
                />
                <span className="text-[10px] text-slate-400">
                  If empty, the cover image will be used as the first photo in the gallery.
                </span>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-[#1540a8] py-2.5 text-xs font-bold text-white hover:bg-[#07174a] cursor-pointer mt-2"
              >
                Save Event to Gallery
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Preview Event Photos */}
      {previewAlbum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-serif-heading text-lg font-bold text-[#07174a]">
                  {previewAlbum.title}
                </h3>
                <span className="text-xs text-slate-500">
                  {previewAlbum.photos?.length || 1} pictures in album
                </span>
              </div>
              <button
                onClick={() => setPreviewAlbum(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(previewAlbum.photos && previewAlbum.photos.length > 0
                ? previewAlbum.photos
                : [previewAlbum.coverUrl]
              ).map((src, i) => (
                <div
                  key={i}
                  className="relative h-36 rounded-xl overflow-hidden bg-slate-100 border border-slate-200"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Photo ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setPreviewAlbum(null)}
                className="rounded-lg bg-slate-200 hover:bg-slate-300 px-4 py-1.5 text-xs font-bold text-slate-800"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Member Profile */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-6 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-slate-200 my-8 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-[#07174a] text-white p-5 sm:p-6 flex items-start justify-between border-b-4 border-amber-400">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                  Secretariat Directory Moderation
                </span>
                <h3 className="font-serif-heading text-xl sm:text-2xl font-bold">
                  Edit Member: {editMemberForm.businessName || editingMember.businessName}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  ID: <span className="font-mono text-amber-200">{editingMember.id}</span> &bull; Modify enterprise credentials, contact channels, and chamber status.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="rounded-full bg-white/10 p-2 text-slate-300 hover:bg-white/20 hover:text-white cursor-pointer transition-colors"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveEditMember} className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 text-xs text-slate-700">
              {editMemberSuccess && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-300 p-4 text-emerald-800 flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold">Member Profile Saved Successfully!</p>
                    <p className="text-[11px] text-emerald-700">
                      Changes have been persisted and email notification dispatched.
                    </p>
                  </div>
                </div>
              )}

              {/* Section 1: Business Identity */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-4">
                <h4 className="font-serif-heading text-sm font-bold text-[#07174a] uppercase tracking-wider border-b border-slate-200 pb-2">
                  1. Business Identity &amp; Classification
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Business Name *</label>
                    <input
                      type="text"
                      required
                      value={editMemberForm.businessName || ''}
                      onChange={(e) => setEditMemberForm({ ...editMemberForm, businessName: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Legal Registered Name</label>
                    <input
                      type="text"
                      value={editMemberForm.legalName || ''}
                      onChange={(e) => setEditMemberForm({ ...editMemberForm, legalName: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Owner / Representative *</label>
                    <input
                      type="text"
                      required
                      value={editMemberForm.ownerName || ''}
                      onChange={(e) => setEditMemberForm({ ...editMemberForm, ownerName: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Business Category *</label>
                    <select
                      value={editMemberForm.category || 'Manufacturing'}
                      onChange={(e) => setEditMemberForm({ ...editMemberForm, category: e.target.value as any })}
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 bg-white"
                    >
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Retail">Retail</option>
                      <option value="Wholesale">Wholesale</option>
                      <option value="Service Provider">Service Provider</option>
                      <option value="Professional">Professional</option>
                      <option value="Distribution">Distribution</option>
                      <option value="Import / Export">Import / Export</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Industry Sector</label>
                    <input
                      type="text"
                      value={editMemberForm.industry || ''}
                      onChange={(e) => setEditMemberForm({ ...editMemberForm, industry: e.target.value })}
                      placeholder="e.g. Iron & Steel, Textiles, IT"
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">GSTIN Number</label>
                    <input
                      type="text"
                      value={editMemberForm.gst || ''}
                      onChange={(e) => setEditMemberForm({ ...editMemberForm, gst: e.target.value })}
                      placeholder="23AAACA0000A1Z5"
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 font-mono bg-white uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Contact & Notification Info */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-serif-heading text-sm font-bold text-[#07174a] uppercase tracking-wider">
                    2. Contact &amp; Notification Coordinates
                  </h4>
                  <span className="text-[10px] text-amber-700 font-medium mt-1 sm:mt-0">
                    &bull; Member alerts (status, reviews) are dispatched to this email
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Member Email Address (Notifications)</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        value={editMemberForm.email || ''}
                        onChange={(e) => setEditMemberForm({ ...editMemberForm, email: e.target.value })}
                        placeholder="contact@enterprise.com"
                        className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-xs text-slate-800 bg-white font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Primary Phone *</label>
                    <input
                      type="text"
                      required
                      value={editMemberForm.phone || ''}
                      onChange={(e) => setEditMemberForm({ ...editMemberForm, phone: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">WhatsApp Business</label>
                    <input
                      type="text"
                      value={editMemberForm.whatsapp || ''}
                      onChange={(e) => setEditMemberForm({ ...editMemberForm, whatsapp: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Location & Business Scale */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-4">
                <h4 className="font-serif-heading text-sm font-bold text-[#07174a] uppercase tracking-wider border-b border-slate-200 pb-2">
                  3. Location, Website &amp; Enterprise Metrics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Complete Commercial Address</label>
                    <input
                      type="text"
                      value={editMemberForm.address || ''}
                      onChange={(e) => setEditMemberForm({ ...editMemberForm, address: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={editMemberForm.city || 'Jabalpur'}
                      onChange={(e) => setEditMemberForm({ ...editMemberForm, city: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={editMemberForm.pinCode || '482001'}
                      onChange={(e) => setEditMemberForm({ ...editMemberForm, pinCode: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 bg-white font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Website URL</label>
                    <input
                      type="url"
                      value={editMemberForm.website || ''}
                      onChange={(e) => setEditMemberForm({ ...editMemberForm, website: e.target.value })}
                      placeholder="https://company.com"
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Established Year</label>
                    <input
                      type="text"
                      value={editMemberForm.estYear || ''}
                      onChange={(e) => setEditMemberForm({ ...editMemberForm, estYear: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Employees Count</label>
                    <input
                      type="text"
                      value={editMemberForm.employees || ''}
                      onChange={(e) => setEditMemberForm({ ...editMemberForm, employees: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Moderation & Spotlight Controls */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-5 space-y-4">
                <h4 className="font-serif-heading text-sm font-bold text-[#07174a] uppercase tracking-wider border-b border-amber-200 pb-2">
                  4. Chamber Moderation &amp; Spotlight Status
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Verification Status</label>
                    <select
                      value={editMemberForm.status || 'pending'}
                      onChange={(e) => setEditMemberForm({ ...editMemberForm, status: e.target.value as any })}
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white"
                    >
                      <option value="approved">Approved &amp; Active</option>
                      <option value="pending">Pending Verification</option>
                      <option value="rejected">Rejected / Incomplete</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Membership Plan</label>
                    <select
                      value={editMemberForm.plan || 'Free'}
                      onChange={(e) => setEditMemberForm({ ...editMemberForm, plan: e.target.value as any })}
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white"
                    >
                      <option value="Free">Free Directory Listing</option>
                      <option value="Pro">Pro Chamber Tier</option>
                      <option value="Premium">Premium Corporate Tier</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-amber-300 bg-white cursor-pointer shadow-xs hover:border-amber-400">
                      <input
                        type="checkbox"
                        checked={Boolean(editMemberForm.featured)}
                        onChange={(e) => setEditMemberForm({ ...editMemberForm, featured: e.target.checked })}
                        className="h-4 w-4 rounded text-amber-600 focus:ring-amber-500"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">⭐ Feature in Spotlight</span>
                        <span className="text-[10px] text-slate-500">Showcase on Homepage &amp; Top of Directory</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 5: Description & Profile Content */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-4">
                <h4 className="font-serif-heading text-sm font-bold text-[#07174a] uppercase tracking-wider border-b border-slate-200 pb-2">
                  5. Business Narrative &amp; Offerings
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Short Overview / Tagline</label>
                    <textarea
                      rows={2}
                      value={editMemberForm.description || ''}
                      onChange={(e) => setEditMemberForm({ ...editMemberForm, description: e.target.value })}
                      placeholder="Concise 1-2 sentence description of enterprise operations…"
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Detailed Products &amp; Services</label>
                    <textarea
                      rows={3}
                      value={editMemberForm.detailed || ''}
                      onChange={(e) => setEditMemberForm({ ...editMemberForm, detailed: e.target.value })}
                      placeholder="Comprehensive list of products, specializations, manufacturing capacity…"
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-0 bg-white py-3">
                <p className="text-[11px] text-slate-500">
                  Saving will update the public directory and alert <span className="font-bold text-[#07174a]">{editMemberForm.email || 'the member'}</span> and <span className="font-bold text-[#07174a]">accjbp@gmail.com</span>.
                </p>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
                    disabled={savingMember}
                    className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingMember}
                    className="rounded-lg bg-[#07174a] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#1540a8] cursor-pointer shadow-md inline-flex items-center gap-2"
                  >
                    {savingMember ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Saving Changes…</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save &amp; Update Member</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
