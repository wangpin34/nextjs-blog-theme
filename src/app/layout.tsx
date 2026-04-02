import Footer from 'components/Footer';
import Layout, { GradientBackground } from 'components/Layout';
import type { Metadata, Viewport } from 'next';
import { getGlobalData } from 'utils/global-data';

import 'styles/globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Penn Wang',
  description: "Penn' blog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const globalData = getGlobalData();
  return (
    <html lang="en" className="theme-compiled">
      <body className="antialiased text-lg bg-white dark:bg-gray-900 dark:text-white leading-base">
        <span className={`theme-${process.env.NEXT_PUBLIC_ANALYTICS_ID}`} />
        <Layout>
          {children}
          <Footer copyrightText={globalData.footerText} />
          <GradientBackground
            variant="large"
            className="fixed top-20 opacity-40 dark:opacity-60"
          />
          <GradientBackground
            variant="small"
            className="absolute bottom-0 opacity-20 dark:opacity-10"
          />
        </Layout>
      </body>
    </html>
  );
}
