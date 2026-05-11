'use client';
// 'use client' нужен потому что используем хуки: useForm, useDispatch, useRouter

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { login } from '@/features/auth/authSlice';

// Схема валидации с помощью Zod
// Zod проверяет данные формы и генерирует сообщения об ошибках
const loginSchema = z.object({
  email: z.string().email({ message: 'Введите корректный email' }),
  password: z.string().min(6, { message: 'Пароль должен быть не менее 6 символов' }),
});

// TypeScript тип — автоматически выводится из схемы Zod
type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  // useForm — хук react-hook-form для управления формой
  // register  — привязывает input к форме
  // handleSubmit — обёртка для onSubmit, вызывает нашу функцию только если валидация прошла
  // formState.errors — объект с ошибками валидации
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema), // подключаем Zod как валидатор
  });

  const onSubmit = (data: LoginFormData) => {
    // Fake auth — в реальном приложении здесь был бы запрос к серверу
    // 1. Сохраняем email в Redux store
    dispatch(login(data.email));
    // 2. Ставим куку — middleware будет проверять её для защиты роутов
    document.cookie = 'isAuthenticated=true; path=/; max-age=86400';
    // 3. Переходим в дашборд
    router.push('/dashboard/clients');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">

        {/* Заголовок */}
        <div className="mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Войти в CRM</h1>
          <p className="text-gray-500 text-sm mt-1">Введите любой email и пароль</p>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Поле Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            {/* register('email') — привязывает input к полю 'email' в форме */}
            <input
              {...register('email')}
              type="email"
              placeholder="example@mail.com"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-colors"
            />
            {/* Показываем ошибку если валидация не прошла */}
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>
            )}
          </div>

          {/* Поле Пароль */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Пароль
            </label>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-colors"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>
            )}
          </div>

          {/* Кнопка входа */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                       text-white font-medium py-2.5 rounded-xl
                       transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Вход...' : 'Войти'}
          </button>
        </form>

        {/* Подсказка для ревью */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Любой email + пароль от 6 символов
        </p>
      </div>
    </div>
  );
}