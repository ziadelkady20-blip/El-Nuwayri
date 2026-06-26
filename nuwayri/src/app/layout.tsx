import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'مطبعة النويري - طباعة احترافية بأعلى جودة',
  description: 'حلول متكاملة للطباعة والتغليف والإعلانات بأحدث التقنيات وأعلى معايير الجودة.',
  keywords: 'مطبعة، طباعة، تغليف، استيكرات، بوكسات، فيوم، مصر',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Cairo', sans-serif" }}>
        <AuthProvider>
          {children}
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: { fontFamily: 'Cairo, sans-serif', direction: 'rtl' },
              duration: 3000,
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
