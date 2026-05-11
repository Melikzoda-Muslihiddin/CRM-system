'use client';

import { useGetClientsQuery } from '@/services/clientsApi';

export default function DashboardPage() {
  const { data: clients, isLoading } = useGetClientsQuery();

  // Считаем средний возраст — берём только клиентов с числовым возрастом > 0
  // (некоторые записи могут иметь age: null или age: "30" как строку)
  const validAges = clients?.map((c) => Number(c.age)).filter((age) => age > 0) ?? [];
  const avgAge = validAges.length
    ? Math.round(validAges.reduce((sum, age) => sum + age, 0) / validAges.length)
    : 0;

  // Группируем клиентов по компаниям: { 'ООО Пример': 3, 'Рога и Копыта': 2, ... }
  const companyCounts = clients?.reduce<Record<string, number>>((acc, client) => {
    const company = client.job.company;
    acc[company] = (acc[company] ?? 0) + 1;
    return acc;
  }, {}) ?? {};

  // Превращаем объект в отсортированный массив: [{ name, count }, ...]
  const companiesRanked = Object.entries(companyCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const topCompany = companiesRanked[0]?.name ?? '—';
  const maxCount = companiesRanked[0]?.count ?? 1;

  // Данные для карточек вверху страницы
  const stats = [
    {
      label: 'Всего клиентов',
      value: isLoading ? '...' : String(clients?.length ?? 0),
      color: 'bg-blue-50 text-blue-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857
               M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857
               m0 0a5.002 5.002 0 019.288 0" />
        </svg>
      ),
    },
    {
      label: 'Средний возраст',
      value: isLoading ? '...' : `${avgAge} лет`,
      color: 'bg-green-50 text-green-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      label: 'Компаний',
      value: isLoading ? '...' : String(companiesRanked.length),
      color: 'bg-purple-50 text-purple-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5
               M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      label: 'Топ компания',
      value: isLoading ? '...' : topCompany,
      color: 'bg-yellow-50 text-yellow-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21
               l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Дашборд</h2>
        <p className="text-gray-500 text-sm mt-1">Общая статистика по клиентам</p>
      </div>

      {/* 4 карточки со статистикой */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className={`inline-flex p-2.5 rounded-xl ${stat.color} mb-3`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900 truncate">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Рейтинг компаний с прогресс-барами */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Клиенты по компаниям</h3>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-1/3 mb-2" />
                <div className="h-2 bg-gray-100 rounded-full" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && companiesRanked.length === 0 && (
          <p className="text-gray-400 text-sm">Нет данных</p>
        )}

        {!isLoading && companiesRanked.length > 0 && (
          <div className="space-y-4">
            {companiesRanked.map(({ name, count }) => (
              <div key={name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-700">{name}</span>
                  <span className="text-sm text-gray-500">{count} чел.</span>
                </div>
                {/* Ширина полоски = (count / maxCount) * 100% */}
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}