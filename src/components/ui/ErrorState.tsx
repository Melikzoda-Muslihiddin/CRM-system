// ErrorState — показывается при ошибке загрузки данных

interface ErrorStateProps {
  message?: string;
}

export default function ErrorState({ message = 'Не удалось загрузить данные' }: ErrorStateProps) {
  return (
    <tr>
      <td colSpan={6} className="px-6 py-16 text-center">
        <div className="flex flex-col items-center gap-3">
          {/* Иконка ошибки */}
          <svg className="w-12 h-12 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="text-gray-700 font-medium">{message}</p>
          <p className="text-gray-400 text-sm">Убедитесь что запущен json-server на порту 3001</p>
        </div>
      </td>
    </tr>
  );
}