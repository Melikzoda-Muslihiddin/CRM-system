import { useState, useEffect } from 'react';

// Ключ под которым храним список избранных ID в localStorage
const STORAGE_KEY = 'crm_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  // При первом рендере читаем сохранённые ID из localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {
      // localStorage недоступен (SSR, приватный режим браузера) — просто игнорируем
    }
  }, []);

  // Добавляет ID в избранное если его нет, убирает если уже есть
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)  // убираем
        : [...prev, id];                  // добавляем

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {/* ignore */}

      return next;
    });
  };

  // Проверяет: находится ли клиент с таким ID в избранном
  const isFavorite = (id: string) => favorites.includes(id);

  return { favorites, toggleFavorite, isFavorite };
}