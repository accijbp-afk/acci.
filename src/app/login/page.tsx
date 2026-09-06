'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/appwrite/auth';
import { Lock, Mail, ArrowRight, ShieldCheck, User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
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
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAdmin = async () => {
    setEmail('admin@acci.org');
    setPassword('Admin@12345');
    setLoading(true);
    try {
      const user = await authService.login('admin@acci.org', 'Admin@12345');
      router.push('/admin');
    } catch {
      // Continue
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

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-700 text-xs font-semibold mb-4">
            {error}
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
            <Link href="/register" className="text-blue-700 font-bold hover:underline">
              Create an account
            </Link>
          </p>

          <div className="mt-4 pt-3 border-t border-dashed border-slate-200">
            <button
              onClick={handleQuickDemoAdmin}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-[#07174a] cursor-pointer"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
              <span>Quick Login as Chamber Admin (Demo)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
