import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'പരാതിപ്പെട്ടി | ParathiPetti - Kerala Panchayat Grievance Redressal System',
  description: 'Official unified grievance redressal portal for Grama Panchayaths in Kerala. Lodge petitions directly to Panchayat authorities and track real-time resolution under the Right to Service Act.',
  keywords: ['Kerala Panchayat', 'LSGD', 'Grievance Redressal', 'ParathiPetti', 'Grama Panchayat', 'Kerala Right to Service Act'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
