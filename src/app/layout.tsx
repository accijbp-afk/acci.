import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/components/common/LanguageContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ACCI – Agrawal Chamber of Commerce & Industries | Jabalpur',
  description:
    "Jabalpur's largest Agrawal business network. Connecting trusted manufacturers, wholesalers, jewellers, professionals, and enterprises across Central India.",
  keywords: [
    'Agrawal Chamber of Commerce',
    'ACCI Jabalpur',
    'Agrawal Committee',
    'Jabalpur business directory',
    'Agrawal business network',
    'Madhya Pradesh trade association',
  ],
  authors: [{ name: 'Agrawal Chamber of Commerce & Industries, Jabalpur' }],
  openGraph: {
    title: 'ACCI – Agrawal Chamber of Commerce & Industries | Jabalpur',
    description: "Jabalpur's largest Agrawal business network and trade federation.",
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-white text-slate-800 font-sans antialiased selection:bg-amber-100 selection:text-amber-900">
        <LanguageProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
