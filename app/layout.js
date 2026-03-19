import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['300','400','500','600','700','800','900'] });

export const metadata = {
  title: 'AEGIS',
  description: 'Track and manage all your product warranties in one place.',
  icons: {
    icon: '/icon.png',
    apple: [
      { url: '/apple-touch-icon-180.png', sizes: '180x180', type: 'image/png' },
      { url: '/apple-touch-icon-152.png', sizes: '152x152', type: 'image/png' },
      { url: '/apple-touch-icon-120.png', sizes: '120x120', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AEGIS',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'theme-color': '#080808',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#080808',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            if (typeof window !== 'undefined' && window.process === undefined) {
              console.log = function() {};
              console.warn = function() {};
              console.error = function() {};
              console.info = function() {};
              console.debug = function() {};
            }
          `
        }} />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
