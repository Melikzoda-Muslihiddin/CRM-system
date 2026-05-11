// EmptyState — показывается когда список пустой (нет клиентов / нет результатов поиска)

interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({ message = 'Клиенты не найдены' }: EmptyStateProps) {
  return (
    <tr>
      <td colSpan={6} className="px-6 py-16 text-center">
        <div className="flex flex-col items-center gap-3">
          {/* Иконка папки */}
          <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4" />
          </svg>
          <p className="text-gray-500 font-medium">{message}</p>
          <p className="text-gray-400 text-sm">Попробуйте изменить поисковый запрос</p>
        </div>
      </td>
    </tr>
  );
}