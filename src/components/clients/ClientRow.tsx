'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useDeleteClientMutation } from '@/services/clientsApi';
import { useToast } from '@/hooks/useToast';
import { Client } from '@/types/client';

interface ClientRowProps {
  client: Client;
}

export default function ClientRow({ client }: ClientRowProps) {
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
          {/* Fallback — инициалы если картинка не загрузилась */}
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

      {/* Кнопка удаления */}
      <td className="px-6 py-4">
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="text-sm text-red-500 hover:text-red-700 hover:bg-red-50
                     px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Удаление...' : 'Удалить'}
        </button>
      </td>
    </tr>
  );
}