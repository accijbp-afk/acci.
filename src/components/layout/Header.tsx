'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/components/common/LanguageContext';
import { authService } from '@/services/appwrite/auth';
import { UserProfile } from '@/types';
import {
  Menu,
  X,
  Phone,
  Mail,
  User,
  LogIn,
  ShieldCheck,
  ChevronDown,
  Building2,
  Briefcase,
  Calendar,
  Newspaper,
  Award,
} from 'lucide-react';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, toggleLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    authService.getCurrentUser().then(setCurrentUser);
  }, [pathname]);

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: t('Home') },
    { href: '/directory', label: t('Business Directory') },
    { href: '/events', label: t('Events & Conclaves') },
    { href: '/gallery', label: t('Gallery') },
    { href: '/jobs', label: t('Opportunities') },
    { href: '/contact', label: t('Contact') },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#07174a] text-white shadow-xl">
      {/* Main Navigation */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Crest & Title */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl p-1 shadow-lg group-hover:scale-105 transition-transform border border-amber-400/40 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/acci_logo.jpg"
              alt="ACCI Logo"
              className="h-full w-full rounded-lg object-contain"
            />
          </div>
          <div>
            <div className="font-serif-heading text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2 leading-tight">
              <span>{t('Agrawal Chambers of Commerce and Industries')}</span>
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User CTAs & Digitally Enabled By Badge */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Digitally Enabled by Lawgical Startup Button */}
          <a
            href="https://lawgicalstartup.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="notranslate flex flex-col justify-center rounded-xl border border-white/30 bg-white/5 px-3 py-1 text-left transition-all hover:bg-white/10 hover:border-amber-400 group shadow-sm shrink-0 cursor-pointer"
            title="Digitally Enabled by Lawgical Startup"
            translate="no"
          >
            <span className="text-[9px] font-medium tracking-wider text-slate-300 uppercase leading-none">
              DIGITALLY ENABLED BY
            </span>
            <span className="text-xs font-bold text-amber-400 group-hover:text-amber-300 transition-colors leading-tight mt-0.5">
              Lawgical Startup
            </span>
          </a>

          {currentUser ? (
            <div className="flex items-center gap-2">
              {currentUser.role === 'admin' && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1 rounded bg-red-600/80 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-600 shadow-sm"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>{t('Admin Panel')}</span>
                </Link>
              )}
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white hover:bg-white/15 transition-all"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 font-bold text-[#07174a]">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span>{currentUser.name.split(' ')[0]}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-md border border-white/20 px-2.5 py-1 text-xs text-slate-300 hover:bg-white/10"
              >
                {t('Logout')}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-md border border-white/25 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition-all"
            >
              <LogIn className="h-3.5 w-3.5 text-amber-300" />
              <span>{t('Login')}</span>
            </Link>
          )}

          <Link
            href="/register"
            className="flex items-center gap-1 rounded-md bg-gradient-to-r from-amber-400 to-amber-500 px-3.5 py-1.5 text-xs font-bold text-[#07174a] shadow hover:from-amber-300 hover:to-amber-400 transition-all hover:-translate-y-0.5"
          >
            <span>{t('Become a Member')}</span>
            <span>→</span>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-md p-2 text-slate-200 hover:bg-white/10 hover:text-white xl:hidden"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#051139] px-4 py-4 xl:hidden">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  pathname === link.href
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              {currentUser ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm text-white font-medium"
                  >
                    <User className="h-4 w-4 text-amber-400" />
                    Dashboard ({currentUser.name})
                  </Link>
                  {currentUser.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 rounded-md bg-red-600/80 px-3 py-2 text-sm text-white font-medium"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Admin Control Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left rounded-md px-3 py-2 text-sm text-red-300 hover:bg-white/5"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-md border border-white/30 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  <LogIn className="h-4 w-4 text-amber-300" />
                  <span>{t('Login')}</span>
                </Link>
              )}

              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center rounded-md bg-amber-400 px-3 py-2 text-sm font-bold text-[#07174a]"
              >
                {t('Become a Member')}
              </Link>

              {/* Mobile Lawgical Startup Badge */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/10">
                <a
                  href="https://lawgicalstartup.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="notranslate flex flex-col rounded-xl border border-white/20 bg-white/5 px-3 py-1.5 text-left transition-all hover:bg-white/10"
                  translate="no"
                >
                  <span className="text-[9px] font-medium tracking-wider text-slate-300 uppercase leading-none">
                    DIGITALLY ENABLED BY
                  </span>
                  <span className="text-xs font-bold text-amber-400 leading-tight mt-0.5">
                    Lawgical Startup
                  </span>
                </a>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
