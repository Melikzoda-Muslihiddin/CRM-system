// Dashboard Layout — применяется ко всем страницам внутри (dashboard)/
// Все страницы /dashboard/* автоматически получат этот layout
//
// (dashboard) — route group (папка в скобках)
// Скобки означают: папка существует только для группировки файлов,
// в URL она не отображается. /dashboard/clients — не /(dashboard)/dashboard/clients

import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function DashboardLayout({
  children,    // children — это конкретная страница (clients, settings и тд)
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Сайдбар слева — фиксированная ширина */}
      <Sidebar />

      {/* Правая часть — хедер + контент страницы */}
      <div className="flex-1 flex flex-col">
        <Header title="CRM Dashboard" />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}