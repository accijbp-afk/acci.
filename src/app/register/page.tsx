'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/appwrite/auth';
import { notificationService } from '@/services/notifications';
import { User, Mail, Lock, Phone, MapPin, ArrowRight, AlertCircle, ExternalLink } from 'lucide-react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Jabalpur');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.register({
        name,
        email,
        password,
        phone,
        city,
      });

      // Dispatch admin alert to accijbp@gmail.com
      notificationService.notifyAdmin({
        event: 'USER_REGISTERED',
        title: `New User Registration: ${name}`,
        subtitle: `A new member profile has been registered on the ACCI Chamber Portal.`,
        details: [
          { label: 'Full Name', value: name },
          { label: 'Email Address', value: email },
          { label: 'Phone Number', value: phone || 'Not provided' },
          { label: 'City', value: city || 'Jabalpur' },
        ],
        actionUrl: '/admin',
      });

      // Dispatch welcome confirmation to the member's registered email
      notificationService.notifyMember(email, {
        event: 'WELCOME_ACCOUNT',
        title: `Welcome to ACCI Jabalpur, ${name}!`,
        subtitle: `Your member account has been created. You can now access the Chamber portal to manage your enterprise listing and post job openings.`,
        details: [
          { label: 'Registered Name', value: name },
          { label: 'Account Email', value: email },
          { label: 'City', value: city || 'Jabalpur' },
          { label: 'Membership Status', value: 'Active Registered User' },
        ],
        actionText: 'Go to Member Dashboard',
        actionUrl: '/dashboard',
      });

      router.push(redirectUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#faf8f5] min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="mx-auto relative h-16 w-16 rounded-2xl overflow-hidden border-2 border-amber-400/50 bg-white p-1.5 shadow-md">
            <Image
              src="/images/acci_logo.jpg"
              alt="ACCI Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold uppercase tracking-wider mt-3 mb-1">
            Official Chamber Membership
          </span>
          <h1 className="font-serif-heading text-2xl font-bold text-[#07174a]">
            Become an ACCI Member
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create your personal Chamber account to access the network, list business enterprises, and post opportunities.
          </p>
        </div>

        {redirectUrl.includes('membership') && (
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-blue-900 text-xs mb-4 text-center">
            <span className="font-semibold">Step 1 of 2:</span> Create your member account to proceed to enterprise registration.
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-red-700 text-xs mb-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{error}</p>
                {error.toLowerCase().includes('paused') && (
                  <div className="mt-2.5 pt-2.5 border-t border-red-200/80 text-[11px] text-red-900 space-y-1.5 leading-relaxed">
                    <p>
                      <strong>Why this happened:</strong> The Appwrite Cloud backend is paused by Appwrite due to free-tier inactivity.
                    </p>
                    <div className="mt-2">
                      <a
                        href="https://cloud.appwrite.io/console"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-700 text-white font-medium hover:bg-red-800 transition-colors shadow-sm"
                      >
                        <span>Restore Project in Console</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Chandra Agrawal"
                className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 94251..."
                  className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">City</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Jabalpur"
                  className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#1540a8] hover:bg-[#07174a] text-white py-3 text-xs font-bold tracking-wide shadow-md transition-all cursor-pointer disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Creating Member Account…</span>
            ) : (
              <>
                <span>Become a Member • Complete Registration</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link
              href={redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : '/login'}
              className="text-blue-700 font-bold hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-slate-500">Loading registration…</div>}>
      <RegisterForm />
    </Suspense>
  );
}
