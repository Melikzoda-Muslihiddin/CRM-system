'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '@/features/auth/authSlice';
import { RootState } from '@/store';

export default function SettingsPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  // Читаем email пользователя из Redux store (он был сохранён при логине)
  const userEmail = useSelector((state: RootState) => state.auth.userEmail);

  const handleLogout = () => {
    // 1. Удаляем куку — proxy.ts использует её для защиты роутов
    document.cookie = 'isAuthenticated=; path=/; max-age=0';
    // 2. Сбрасываем состояние в Redux
    dispatch(logout());
    // 3. Отправляем на страницу входа
    router.push('/login');
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Настройки</h2>
        <p className="text-gray-500 text-sm mt-1">Профиль и управление аккаунтом</p>
      </div>

      {/* Карточка профиля */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Профиль</h3>
        <div className="flex items-center gap-4">
          {/* Аватар с первой буквой email */}
          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
            <span className="text-white text-xl font-bold">
              {userEmail?.charAt(0).toUpperCase() ?? 'U'}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{userEmail ?? 'Пользователь'}</p>
            <p className="text-sm text-gray-500">Администратор</p>
          </div>
        </div>
      </div>

      {/* Карточка с информацией о системе */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
        <h3 className="text-base font-semibold text-gray-900 mb-4">О системе</h3>
        <div className="space-y-3">
          {[
            { label: 'Версия', value: '1.0.0' },
            { label: 'Фреймворк', value: 'Next.js 16 (App Router)' },
            { label: 'Состояние', value: 'Redux Toolkit + RTK Query' },
            { label: 'База данных', value: 'JSON Server (db.json)' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-gray-500">{label}</span>
              <span className="text-gray-900 font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Карточка выхода */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-1">Выход из системы</h3>
        <p className="text-sm text-gray-500 mb-4">
          Куки и сессия будут удалены, вас перенаправит на страницу входа
        </p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100
                     text-red-600 font-medium text-sm rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Выйти из системы
        </button>
      </div>
    </div>
  );
}