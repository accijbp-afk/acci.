'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/appwrite/auth';
import { notificationService } from '@/services/notifications';
import { User, Mail, Lock, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
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

      router.push('/dashboard');
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
          <h1 className="font-serif-heading text-2xl font-bold text-[#07174a] mt-3">
            Create Chamber Account
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Join the ACCI digital network to manage your business listing and vacancies.
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-700 text-xs font-semibold mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sudhi Agrawal"
                className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
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
                placeholder="name@enterprise.com"
                className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mobile Phone *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">City / Area</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Jabalpur"
                  className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-xs text-slate-800 focus:outline-none focus:border-[#1540a8]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#1540a8] hover:bg-[#07174a] text-white py-3 text-xs font-bold tracking-wide shadow-md transition-all cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? 'Creating Account…' : 'Register Account'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-700 font-bold hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
