'use client';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

// SearchBar — поле поиска клиентов
// value и onChange пробрасываются из родительского компонента (controlled input)
export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      {/* Иконка поиска */}
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Поиск по имени или email..."
        className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm w-72
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   bg-white transition-colors"
      />
    </div>
  );
}