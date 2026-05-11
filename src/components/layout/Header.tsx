'use client';
// 'use client' нужен для useSelector (читаем email из Redux) и useRouter (редирект после логаута)

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store/index';
import { logout } from '@/features/auth/authSlice';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const dispatch = useDispatch();
  const router = useRouter();

  // Читаем email пользователя из Redux store
  const userEmail = useSelector((state: RootState) => state.auth.userEmail);

  const handleLogout = () => {
    // 1. Очищаем Redux state
    dispatch(logout());
    // 2. Удаляем куку авторизации (expires в прошлом = удаление)
    document.cookie = 'isAuthenticated=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    // 3. Редиректим на страницу входа
    router.push('/login');
  };

  return (
    <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
      {/* Заголовок страницы — передаётся из каждой страницы */}
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>

      {/* Блок пользователя справа */}
      <div className="flex items-center gap-4">
        {/* Аватар и email */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-700 text-sm font-medium">
              {/* Берём первую букву email для аватара */}
              {userEmail?.[0]?.toUpperCase() ?? 'U'}
            </span>
          </div>
          <span className="text-sm text-gray-600 hidden sm:block">{userEmail}</span>
        </div>

        {/* Кнопка выхода */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Выйти
        </button>
      </div>
    </header>
  );
}