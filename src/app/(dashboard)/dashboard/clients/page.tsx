'use client';

import { useState } from 'react';
import { useGetClientsQuery } from '@/services/clientsApi';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';
import ClientRow from '@/components/clients/ClientRow';
import SearchBar from '@/components/clients/SearchBar';
import AddClientModal from '@/components/clients/AddClientModal';
import SkeletonRow from '@/components/ui/SkeletonRow';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';

// Поля по которым можно сортировать
type SortField = 'fullName' | 'age' | 'company';
type SortDir = 'asc' | 'desc';

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Показывать только избранных
  const [showFavOnly, setShowFavOnly] = useState(false);

  // Текущее поле и направление сортировки (null = без сортировки)
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const { data: clients, isLoading, isError } = useGetClientsQuery();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // Клик по заголовку колонки: если уже сортируем по этому полю — меняем направление, иначе — меняем поле
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  // 1. Фильтрация по поисковой строке
  const afterSearch = clients?.filter((client) => {
    const query = search.toLowerCase();
    return (
      client.fullName.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query)
    );
  });

  // 2. Фильтрация по избранному
  const afterFavorites = showFavOnly
    ? afterSearch?.filter((client) => isFavorite(client.id))
    : afterSearch;

  // 3. Сортировка
  const sortedClients = [...(afterFavorites ?? [])].sort((a, b) => {
    if (!sortField) return 0;

    // Получаем значение поля для сравнения
    const aVal = sortField === 'company' ? a.job.company
      : sortField === 'age' ? a.age
      : a.fullName;
    const bVal = sortField === 'company' ? b.job.company
      : sortField === 'age' ? b.age
      : b.fullName;

    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  // Иконка стрелки для заголовка сортируемой колонки
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      // Нейтральная иконка — показывает что колонка кликабельна
      return (
        <svg className="w-3.5 h-3.5 text-gray-300 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    // Активная иконка — показывает направление
    return sortDir === 'asc' ? (
      <svg className="w-3.5 h-3.5 text-blue-500 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-3.5 h-3.5 text-blue-500 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div>
      {/* Шапка страницы */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Клиенты</h2>
          <p className="text-gray-500 text-sm mt-1">
            {clients ? `Всего: ${clients.length}` : 'Загрузка...'}
            {showFavOnly && favorites.length > 0 && ` · Избранных: ${favorites.length}`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Кнопка-фильтр Избранные */}
          <button
            onClick={() => setShowFavOnly((prev) => !prev)}
            title="Показать только избранных"
            className={cn(
              'flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors border',
              showFavOnly
                ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            )}
          >
            <svg
              className={`w-4 h-4 ${showFavOnly ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915
                   c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674
                   c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888
                   c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888
                   c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Избранные
          </button>

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

              {/* Сортируемые заголовки: кликабельные */}
              <th
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
                onClick={() => handleSort('fullName')}
              >
                Имя <SortIcon field="fullName" />
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Телефон</th>

              <th
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
                onClick={() => handleSort('company')}
              >
                Компания <SortIcon field="company" />
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Действия</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <><SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow /></>}
            {isError && <ErrorState />}
            {!isLoading && !isError && sortedClients.length === 0 && (
              <EmptyState message={
                showFavOnly ? 'Нет избранных клиентов'
                : search ? 'Ничего не найдено'
                : 'Список клиентов пуст'
              } />
            )}
            {sortedClients.map((client) => (
              <ClientRow
                key={client.id}
                client={client}
                isFavorite={isFavorite(client.id)}
                onToggleFavorite={() => toggleFavorite(client.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Модалка добавления — рендерится поверх всего */}
      {showAddModal && <AddClientModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}