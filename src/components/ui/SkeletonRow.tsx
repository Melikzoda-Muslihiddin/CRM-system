// SkeletonRow — показывается пока данные загружаются
// Анимация 'animate-pulse' из Tailwind создаёт эффект мигания

export default function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b border-gray-100">
      {/* Аватар */}
      <td className="px-6 py-4">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
      </td>
      {/* Имя */}
      <td className="px-6 py-4">
        <div className="h-4 w-36 bg-gray-200 rounded" />
      </td>
      {/* Email */}
      <td className="px-6 py-4">
        <div className="h-4 w-48 bg-gray-200 rounded" />
      </td>
      {/* Телефон */}
      <td className="px-6 py-4">
        <div className="h-4 w-32 bg-gray-200 rounded" />
      </td>
      {/* Компания */}
      <td className="px-6 py-4">
        <div className="h-4 w-40 bg-gray-200 rounded" />
      </td>
      {/* Кнопка */}
      <td className="px-6 py-4">
        <div className="h-8 w-20 bg-gray-200 rounded-lg" />
      </td>
    </tr>
  );
}