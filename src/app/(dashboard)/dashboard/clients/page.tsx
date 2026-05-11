'use client';

import { useState } from 'react';
import { useGetClientsQuery } from '@/services/clientsApi';
import ClientRow from '@/components/clients/ClientRow';
import SearchBar from '@/components/clients/SearchBar';
import AddClientModal from '@/components/clients/AddClientModal';
import SkeletonRow from '@/components/ui/SkeletonRow';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false); // управляет показом модалки

  const { data: clients, isLoading, isError } = useGetClientsQuery();

  // Фильтрация по имени и email
  const filteredClients = clients?.filter((client) => {
    const query = search.toLowerCase();
    return (
      client.fullName.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      {/* Шапка страницы */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Клиенты</h2>
          <p className="text-gray-500 text-sm mt-1">
            {clients ? `Всего: ${clients.length}` : 'Загрузка...'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <SearchBar value={search} onChange={setSearch} />

          {/* Кнопка добавления клиента */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white
                       px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Добавить
          </button>
        </div>
      </div>

      {/* Таблица */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Фото</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Имя</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Телефон</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Компания</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Действия</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <><SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow /></>}
            {isError && <ErrorState />}
            {!isLoading && !isError && filteredClients?.length === 0 && (
              <EmptyState message={search ? 'Ничего не найдено' : 'Список клиентов пуст'} />
            )}
            {filteredClients?.map((client) => (
              <ClientRow key={client.id} client={client} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Модалка добавления — рендерится поверх всего */}
      {showAddModal && <AddClientModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}