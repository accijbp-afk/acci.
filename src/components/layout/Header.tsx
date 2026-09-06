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
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);

  useEffect(() => {
    authService.getCurrentUser().then(setCurrentUser);
  }, [pathname]);

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: t('nav_home', 'Home') },
    {
      href: '/about',
      label: t('nav_about', 'About Us'),
      children: [
        { href: '/about', label: 'Overview & Legacy' },
        { href: '/committee', label: 'Committee & Leadership' },
      ],
    },
    { href: '/directory', label: t('nav_directory', 'Directory') },
    { href: '/events', label: t('nav_events', 'Events') },
    { href: '/jobs', label: t('nav_jobs', 'Opportunities') },
    { href: '/news', label: t('nav_news', 'Circulars & News') },
    { href: '/membership', label: t('nav_membership', 'Membership') },
    { href: '/contact', label: t('nav_contact', 'Contact') },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#07174a] text-white shadow-xl">
      {/* Top Institutional Bar */}
      <div className="border-b border-white/10 bg-[#040e30] px-4 py-1.5 text-xs text-slate-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block font-medium tracking-wide text-amber-300/90">
              🏛️ {t('chamber_name', 'Agrawal Chamber of Commerce & Industries')} • Jabalpur (M.P.)
            </span>
            <div className="flex items-center gap-3">
              <a
                href="tel:+918319565363"
                className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
              >
                <Phone className="h-3 w-3 text-amber-400" />
                <span>+91 8319565363</span>
              </a>
              <span className="hidden text-slate-500 md:inline">|</span>
              <a
                href="mailto:accijabalpur@gmail.com"
                className="hidden md:flex items-center gap-1.5 hover:text-amber-300 transition-colors"
              >
                <Mail className="h-3 w-3 text-amber-400" />
                <span>accijabalpur@gmail.com</span>
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Bilingual Toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center rounded-full border border-amber-400/40 bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold tracking-wider text-amber-300 hover:bg-white/10 transition-all cursor-pointer"
              title="Toggle English / हिन्दी"
            >
              <span className={lang === 'en' ? 'text-white font-bold underline' : 'opacity-70'}>EN</span>
              <span className="mx-1 opacity-40">/</span>
              <span className={lang === 'hi' ? 'text-white font-bold underline' : 'opacity-70'}>हिन्दी</span>
            </button>

            {currentUser && currentUser.role === 'admin' && (
              <Link
                href="/admin"
                className="hidden sm:flex items-center gap-1 rounded bg-red-600/80 px-2 py-0.5 text-[11px] font-medium text-white hover:bg-red-600"
              >
                <ShieldCheck className="h-3 w-3" />
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      </div>

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
            <div className="font-serif-heading text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>AGRAWAL COMMITTEE</span>
              <span className="text-[10px] uppercase font-sans tracking-widest bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-400/30 hidden lg:inline">
                ACCI
              </span>
            </div>
            <div className="text-[11px] tracking-wider text-slate-300 font-medium uppercase">
              Chamber of Commerce & Industries • Jabalpur
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            if (link.children) {
              return (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setAboutDropdownOpen(true)}
                  onMouseLeave={() => setAboutDropdownOpen(false)}
                >
                  <button
                    className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      isActive || pathname.startsWith('/committee')
                        ? 'bg-white/15 text-white font-semibold'
                        : 'text-slate-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                  </button>

                  {aboutDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1 w-52 rounded-lg border border-slate-700 bg-[#07174a] py-1.5 shadow-2xl backdrop-blur">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 hover:text-amber-300 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

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

        {/* User CTAs */}
        <div className="hidden md:flex items-center gap-2.5">
          {currentUser ? (
            <div className="flex items-center gap-2">
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
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-md border border-white/25 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition-all"
            >
              <User className="h-3.5 w-3.5 text-amber-300" />
              <span>{t('btn_login', 'Member Portal')}</span>
            </Link>
          )}

          <Link
            href="/membership"
            className="flex items-center gap-1 rounded-md bg-gradient-to-r from-amber-400 to-amber-500 px-3.5 py-1.5 text-xs font-bold text-[#07174a] shadow hover:from-amber-300 hover:to-amber-400 transition-all hover:-translate-y-0.5"
          >
            <span>{t('btn_join', 'Become a Member')}</span>
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
                  className="flex items-center justify-center rounded-md border border-white/30 px-3 py-2 text-sm font-semibold text-white"
                >
                  {t('btn_login', 'Member Portal Login')}
                </Link>
              )}

              <Link
                href="/membership"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center rounded-md bg-amber-400 px-3 py-2 text-sm font-bold text-[#07174a]"
              >
                {t('btn_join', 'Become a Member')}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
