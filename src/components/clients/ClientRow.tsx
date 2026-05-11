'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useDeleteClientMutation } from '@/services/clientsApi';
import { useToast } from '@/hooks/useToast';
import { Client } from '@/types/client';

interface ClientRowProps {
  client: Client;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function ClientRow({ client, isFavorite, onToggleFavorite }: ClientRowProps) {
  const [deleteClient, { isLoading }] = useDeleteClientMutation();
  const toast = useToast();

  const handleDelete = async () => {
    if (!confirm(`Удалить клиента ${client.fullName}?`)) return;

    try {
      await deleteClient(client.id).unwrap();
      toast.success(`${client.fullName} удалён`);
    } catch {
      toast.error('Не удалось удалить клиента');
    }
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">

      {/* Аватар */}
      <td className="px-6 py-4">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
          <Image
            src={client.avatar}
            alt={client.fullName}
            fill
            className="object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          {/* Fallback — инициал если картинка не загрузилась */}
          <span className="text-blue-700 text-sm font-semibold absolute">
            {client.fullName.charAt(0)}
          </span>
        </div>
      </td>

      {/* Имя — ссылка на страницу клиента */}
      <td className="px-6 py-4">
        <Link
          href={`/dashboard/clients/${client.id}`}
          className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
        >
          {client.fullName}
        </Link>
      </td>

      {/* Email */}
      <td className="px-6 py-4">
        <span className="text-gray-600 text-sm">{client.email}</span>
      </td>

      {/* Телефон */}
      <td className="px-6 py-4">
        <span className="text-gray-600 text-sm">{client.contacts.phone}</span>
      </td>

      {/* Компания */}
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
          {client.job.company}
        </span>
      </td>

      {/* Действия: звёздочка + удаление */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {/* Кнопка избранного: жёлтая если в избранном, серая если нет */}
          <button
            onClick={onToggleFavorite}
            title={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
            className="p-1.5 rounded-lg transition-colors hover:bg-gray-100"
          >
            <svg
              className={`w-4 h-4 transition-colors ${isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
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
          </button>

          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="text-sm text-red-500 hover:text-red-700 hover:bg-red-50
                       px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Удаление...' : 'Удалить'}
          </button>
        </div>
      </td>
    </tr>
  );
}