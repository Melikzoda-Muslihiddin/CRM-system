// cn() — утилита для объединения CSS-классов
// Пример: cn('text-white', isActive && 'bg-blue-500')  → 'text-white bg-blue-500'
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}