// Корневой layout — оборачивает ВСЁ приложение
// Здесь подключаем Redux Provider и глобальный ToastContainer

import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import ReduxProvider from '@/store/Provider';
import ToastContainer from '@/components/ui/Toast';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CRM Dashboard',
  description: 'Client management system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.className}>
      <body className="bg-gray-50 text-gray-900">
        <ReduxProvider>
          {children}
          {/* ToastContainer — показывает уведомления поверх всего приложения */}
          <ToastContainer />
        </ReduxProvider>
      </body>
    </html>
  );
}