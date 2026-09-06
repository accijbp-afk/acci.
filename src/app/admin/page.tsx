'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/appwrite/auth';
import { membersService } from '@/services/appwrite/members';
import { eventsService } from '@/services/appwrite/events';
import { newsService } from '@/services/appwrite/news';
import { jobsService } from '@/services/appwrite/jobs';
import { inquiriesService } from '@/services/appwrite/inquiries';
import {
  UserProfile,
  MemberBusiness,
  ChamberEvent,
  ChamberNews,
  JobListing,
  ContactSubmission,
  BusinessReview,
} from '@/types';
import {
  ShieldCheck,
  Building2,
  Users,
  Calendar,
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
  Check,
  Clock,
  Filter,
  CheckCheck,
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'vendors' | 'events' | 'news' | 'jobs' | 'inquiries' | 'reviews'
  >('overview');

  // Data states
  const [vendors, setVendors] = useState<MemberBusiness[]>([]);
  const [events, setEvents] = useState<ChamberEvent[]>([]);
  const [news, setNews] = useState<ChamberNews[]>([]);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [inquiries, setInquiries] = useState<ContactSubmission[]>([]);
  const [reviews, setReviews] = useState<BusinessReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Filter States
  const [vendorSearch, setVendorSearch] = useState('');
  const [vendorStatusFilter, setVendorStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [vendorCategoryFilter, setVendorCategoryFilter] = useState('all');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // New Event Form State
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [submittingEvent, setSubmittingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'Business Networking',
    date: new Date().toISOString().split('T')[0],
    time: '11:00 AM',
    venue: '',
    description: '',
  });

  // New News Form State
  const [showAddNewsModal, setShowAddNewsModal] = useState(false);
  const [submittingNews, setSubmittingNews] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: '',
    category: 'Chamber Circular',
    excerpt: '',
    content: '',
    author: 'Secretariat, ACCI Jabalpur',
  });

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [vRes, evRes, nRes, jRes, inqRes, revRes] = await Promise.all([
        membersService.getMembers({ status: 'all' }),
        eventsService.getEvents(),
        newsService.getNews(),
        jobsService.getJobs(),
        inquiriesService.getInquiries(),
        membersService.getAllReviewsAdmin(),
      ]);

      setVendors(vRes.members);
      setEvents(evRes);
      setNews(nRes);
      setJobs(jRes);
      setInquiries(inqRes);
      setReviews(revRes);
    } catch (err) {
      console.error('Failed to load admin data', err);
      showToast('Error syncing some admin records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    authService.getCurrentUser().then((u) => {
      if (!u) {
        router.push('/login');
        return;
      }
      if (u.role !== 'admin') {
        setCurrentUser(u);
        setLoading(false);
        return;
      }
      setCurrentUser(u);
      loadAllData();
    });
  }, [router]);

  // Vendor Handlers
  const handleVendorStatus = async (id: string, status: 'approved' | 'rejected' | 'pending') => {
    await membersService.updateMemberStatus(id, status);
    showToast(`Enterprise status updated to ${status}`);
    loadAllData();
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    await membersService.toggleFeatured(id, !current);
    showToast(current ? 'Removed from featured listings' : 'Marked as Featured enterprise');
    loadAllData();
  };

  const handleDeleteVendor = async (id: string, name: string) => {
    if (confirm(`Permanently remove "${name}" from Chamber records?`)) {
      await membersService.deleteMember(id);
      showToast(`Removed "${name}" from directory`);
      loadAllData();
    }
  };

  // Event Handlers
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;
    setSubmittingEvent(true);
    try {
      await eventsService.createEvent({
        ...newEvent,
        slug: newEvent.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      });
      setShowAddEventModal(false);
      setNewEvent({
        title: '',
        category: 'Business Networking',
        date: new Date().toISOString().split('T')[0],
        time: '11:00 AM',
        venue: '',
        description: '',
      });
      showToast('Event published successfully!');
      loadAllData();
    } catch {
      showToast('Failed to create event', 'error');
    } finally {
      setSubmittingEvent(false);
    }
  };

  const handleDeleteEvent = async (id: string, title: string) => {
    if (confirm(`Delete event "${title}"?`)) {
      await eventsService.deleteEvent(id);
      showToast('Event deleted successfully');
      loadAllData();
    }
  };

  // News Handlers
  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.title.trim()) return;
    setSubmittingNews(true);
    try {
      await newsService.createNews({
        ...newArticle,
        slug: newArticle.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
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
      showToast('Circular published to Chamber newsfeed');
      loadAllData();
    } catch {
      showToast('Failed to publish circular', 'error');
    } finally {
      setSubmittingNews(false);
    }
  };

  const handleDeleteNews = async (id: string, title: string) => {
    if (confirm(`Delete circular "${title}"?`)) {
      await newsService.deleteNews(id);
      showToast('Circular deleted');
      loadAllData();
    }
  };

  // Jobs Handlers
  const handleToggleJobStatus = async (id: string, currentStatus: 'Active' | 'Closed') => {
    const nextStatus = currentStatus === 'Active' ? 'Closed' : 'Active';
    await jobsService.toggleJobStatus(id, nextStatus);
    showToast(`Job listing status set to ${nextStatus}`);
    loadAllData();
  };

  const handleDeleteJob = async (id: string) => {
    if (confirm('Delete this job posting?')) {
      await jobsService.deleteJob(id);
      showToast('Job posting removed');
      loadAllData();
    }
  };

  // Inquiries Handlers
  const handleInquiryStatus = async (id: string, status: 'unread' | 'read' | 'resolved') => {
    await inquiriesService.updateStatus(id, status);
    showToast(`Inquiry marked as ${status}`);
    loadAllData();
  };

  const handleDeleteInquiry = async (id: string) => {
    if (confirm('Delete this inquiry?')) {
      await inquiriesService.deleteInquiry(id);
      showToast('Inquiry removed');
      loadAllData();
    }
  };

  // Reviews Handlers
  const handleReviewStatus = async (id: string, status: 'approved' | 'pending') => {
    await membersService.updateReviewStatus(id, status);
    showToast(`Review status updated to ${status}`);
    loadAllData();
  };

  const handleDeleteReview = async (id: string) => {
    if (confirm('Delete this customer review?')) {
      await membersService.deleteReview(id);
      showToast('Review deleted');
      loadAllData();
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    router.push('/');
  };

  // Filtered vendors
  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const matchSearch =
        !vendorSearch ||
        v.businessName.toLowerCase().includes(vendorSearch.toLowerCase()) ||
        v.ownerName.toLowerCase().includes(vendorSearch.toLowerCase()) ||
        v.industry.toLowerCase().includes(vendorSearch.toLowerCase()) ||
        (v.gst && v.gst.toLowerCase().includes(vendorSearch.toLowerCase()));

      const matchStatus = vendorStatusFilter === 'all' || v.status === vendorStatusFilter;
      const matchCategory = vendorCategoryFilter === 'all' || v.category === vendorCategoryFilter;

      return matchSearch && matchStatus && matchCategory;
    });
  }, [vendors, vendorSearch, vendorStatusFilter, vendorCategoryFilter]);

  if (loading && !currentUser) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#1540a8] border-r-transparent" />
        <p className="mt-3 text-xs text-slate-500">Verifying Secretariat Credentials…</p>
      </div>
    );
  }

  // Unauthorized view for non-admin accounts
  if (currentUser && currentUser.role !== 'admin') {
    return (
      <div className="bg-[#faf8f5] min-h-[80vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-2xl border border-red-200 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4">
            <XCircle className="h-8 w-8" />
          </div>
          <h2 className="font-serif-heading text-xl font-bold text-slate-900">
            Access Restricted
          </h2>
          <p className="text-xs text-slate-600 mt-2">
            The Chamber Secretariat Control Panel requires verified Administrator credentials. You are currently logged in as <strong>{currentUser.email}</strong> with role <strong>{currentUser.role}</strong>.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard"
              className="rounded-xl bg-[#1540a8] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#07174a]"
            >
              Go to Member Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Switch Account / Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#faf8f5] min-h-screen pb-20">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 rounded-xl px-4 py-3 text-xs font-bold shadow-xl border transition-all ${
            notification.type === 'error'
              ? 'bg-red-50 text-red-800 border-red-300'
              : 'bg-emerald-50 text-emerald-800 border-emerald-300'
          }`}
        >
          {notification.message}
        </div>
      )}

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
                <span className="rounded bg-red-600/90 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-white">
                  Superadmin
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Agrawal Chamber of Commerce & Industries • Jabalpur Secretariat
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
            { id: 'vendors', label: `Enterprises (${vendors.length})`, icon: Users },
            { id: 'events', label: `Events (${events.length})`, icon: Calendar },
            { id: 'news', label: `Circulars (${news.length})`, icon: Newspaper },
            { id: 'jobs', label: `Jobs (${jobs.length})`, icon: Briefcase },
            { id: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: Mail },
            { id: 'reviews', label: `Reviews (${reviews.length})`, icon: Star },
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif-heading text-lg font-bold text-[#07174a]">
                  Recent Business Applications
                </h2>
                <button
                  onClick={() => setActiveTab('vendors')}
                  className="text-xs font-bold text-blue-700 hover:underline"
                >
                  View All Enterprises ({vendors.length}) →
                </button>
              </div>
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
                                : v.status === 'rejected'
                                ? 'bg-red-50 text-red-700 border border-red-200'
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
                  Enterprise Moderation & Directory Management
                </h2>
                <p className="text-xs text-slate-500">
                  Approve vendor listings, toggle featured showcase cards, or manage members.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {/* Search Bar */}
                <div className="relative flex-1 sm:w-60">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={vendorSearch}
                    onChange={(e) => setVendorSearch(e.target.value)}
                    placeholder="Search name, owner, GST…"
                    className="w-full rounded-lg border border-slate-300 py-1.5 pl-8 pr-3 text-xs text-slate-800"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={vendorStatusFilter}
                  onChange={(e) => setVendorStatusFilter(e.target.value as any)}
                  className="rounded-lg border border-slate-300 py-1.5 px-2.5 text-xs text-slate-700"
                >
                  <option value="all">All Statuses ({vendors.length})</option>
                  <option value="approved">Approved ({vendors.filter(v => v.status === 'approved').length})</option>
                  <option value="pending">Pending ({vendors.filter(v => v.status === 'pending').length})</option>
                  <option value="rejected">Rejected ({vendors.filter(v => v.status === 'rejected').length})</option>
                </select>
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
                    <th className="p-3 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredVendors.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400 italic">
                        No enterprise records match the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredVendors.map((v) => (
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
                            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                              v.featured
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
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
                          {v.status !== 'approved' && (
                            <button
                              onClick={() => handleVendorStatus(v.id, 'approved')}
                              className="rounded bg-emerald-600 px-2 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 cursor-pointer"
                            >
                              Approve
                            </button>
                          )}
                          {v.status !== 'rejected' && (
                            <button
                              onClick={() => handleVendorStatus(v.id, 'rejected')}
                              className="rounded bg-slate-200 px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-red-600 hover:text-white cursor-pointer"
                            >
                              Reject
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteVendor(v.id, v.businessName)}
                            className="rounded p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                            title="Delete enterprise"
                          >
                            <Trash2 className="h-3.5 w-3.5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: EVENTS MANAGEMENT */}
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
                      onClick={() => handleDeleteEvent(ev.id, ev.title)}
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
                    onClick={() => handleDeleteNews(item.id, item.title)}
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
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div>
                <h2 className="font-serif-heading text-lg font-bold text-[#07174a]">
                  Community Job Postings
                </h2>
                <p className="text-xs text-slate-500">Manage active employment vacancies across member firms.</p>
              </div>
              <Link
                href="/jobs/post"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1540a8] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#07174a]"
              >
                <PlusCircle className="h-4 w-4" />
                <span>+ Post New Vacancy</span>
              </Link>
            </div>

            <div className="space-y-3">
              {jobs.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-4 text-center">No job listings found.</p>
              ) : (
                jobs.map((j) => (
                  <div key={j.id} className="rounded-xl border border-slate-200 p-4 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-[#07174a] text-sm">{j.title}</h3>
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            j.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {j.status}
                        </span>
                      </div>
                      <div className="text-slate-500 mt-1">
                        🏢 {j.company} • 📍 {j.location} • 💰 {j.salary} • ⏱️ {j.jobType}
                      </div>
                      {j.description && (
                        <p className="text-slate-600 mt-1.5 line-clamp-1">{j.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleJobStatus(j.id, j.status as any)}
                        className="rounded border border-slate-300 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        {j.status === 'Active' ? 'Close Listing' : 'Reactivate'}
                      </button>
                      <button
                        onClick={() => handleDeleteJob(j.id)}
                        className="rounded p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                        title="Delete vacancy"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
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
              <p className="text-xs text-slate-400 italic py-6 text-center">No inquiries received yet.</p>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="rounded-xl border border-slate-200 p-5 text-xs bg-slate-50/50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-2 mb-3 gap-2">
                      <div>
                        <strong className="text-[#07174a] text-sm">{inq.name}</strong>
                        <span className="text-slate-500 ml-2 font-mono">{inq.phone} • {inq.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            inq.status === 'resolved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : inq.status === 'read'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {inq.status}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="font-bold text-slate-700 mb-1">Subject: {inq.subject}</div>
                    <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{inq.message}</p>

                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-end gap-2">
                      {inq.status !== 'read' && inq.status !== 'resolved' && (
                        <button
                          onClick={() => handleInquiryStatus(inq.id, 'read')}
                          className="rounded bg-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-300 cursor-pointer"
                        >
                          Mark as Read
                        </button>
                      )}
                      {inq.status !== 'resolved' && (
                        <button
                          onClick={() => handleInquiryStatus(inq.id, 'resolved')}
                          className="rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 cursor-pointer"
                        >
                          Mark Resolved
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteInquiry(inq.id)}
                        className="rounded p-1 text-slate-400 hover:text-red-600 cursor-pointer ml-1"
                        title="Delete inquiry"
                      >
                        <Trash2 className="h-3.5 w-3.5 inline" />
                      </button>
                    </div>
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
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-6 text-center">No reviews submitted yet.</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="rounded-xl border border-slate-200 p-4 text-xs flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-800">{rev.reviewerName}</strong>
                        <span className="text-amber-500">{'★'.repeat(rev.rating)}</span>
                        <span className="text-slate-400">for {rev.businessName}</span>
                      </div>
                      <p className="text-slate-600 mt-1">{rev.reviewText}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
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
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="rounded p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                        title="Delete review"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
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
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 cursor-pointer"
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
                  placeholder="e.g. ACCI Annual Business Conclave"
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
                    <option value="General Body Meeting">General Body Meeting</option>
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
                    placeholder="e.g. 04:00 PM"
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Venue *</label>
                  <input
                    type="text"
                    required
                    value={newEvent.venue}
                    onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                    placeholder="e.g. Hotel Satkar, Jabalpur"
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
                  placeholder="Event agenda, keynote speakers, delegate requirements…"
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800"
                />
              </div>
              <button
                type="submit"
                disabled={submittingEvent}
                className="w-full rounded-lg bg-[#1540a8] py-2.5 text-xs font-bold text-white hover:bg-[#07174a] cursor-pointer disabled:opacity-50"
              >
                {submittingEvent ? 'Publishing…' : 'Publish Event'}
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
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 cursor-pointer"
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
                  <option value="Legal & Tax Update">Legal & Tax Update</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Excerpt *</label>
                <input
                  type="text"
                  required
                  value={newArticle.excerpt}
                  onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                  placeholder="1-2 sentences brief summary…"
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
                  placeholder="Full circular text, guidelines, statutory notifications…"
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800"
                />
              </div>
              <button
                type="submit"
                disabled={submittingNews}
                className="w-full rounded-lg bg-[#1540a8] py-2.5 text-xs font-bold text-white hover:bg-[#07174a] cursor-pointer disabled:opacity-50"
              >
                {submittingNews ? 'Publishing…' : 'Publish Official Circular'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
