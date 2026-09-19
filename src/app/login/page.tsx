'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/appwrite/auth';
import { Lock, Mail, ArrowRight, ShieldCheck, User, AlertCircle, ExternalLink } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await authService.login(email, password);
      if (user.role === 'admin' && !redirectUrl) {
        router.push('/admin');
      } else {
        router.push(redirectUrl || '/dashboard');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please try again.');
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
          <h1 className="font-serif-heading text-2xl font-bold text-[#07174a] mt-3">
            Member Portal Sign In
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access your Chamber business profile, job postings, and credentials.
          </p>
        </div>

        {redirectUrl && (
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-blue-900 text-xs mb-4 text-center">
            <span>Log in to your member account to proceed to enterprise listing.</span>
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
                        Open Appwrite Console to Restore
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@enterprise.com"
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">Password</label>
              <Link href="/contact" className="text-[11px] text-blue-700 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#1540a8] hover:bg-[#07174a] text-white py-3 text-xs font-bold tracking-wide shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Authenticating…' : 'Sign In to Portal'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Don&apos;t have an account yet?{' '}
            <Link
              href={redirectUrl ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : '/register'}
              className="text-blue-700 font-bold hover:underline"
            >
              Become a Member (Free)
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-slate-500">Loading sign in…</div>}>
      <LoginForm />
    </Suspense>
  );
}
