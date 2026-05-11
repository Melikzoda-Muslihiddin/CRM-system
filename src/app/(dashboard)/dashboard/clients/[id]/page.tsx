'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGetClientByIdQuery, useUpdateClientMutation } from '@/services/clientsApi';
import { useToast } from '@/hooks/useToast';

// Zod v4: сообщение об ошибке передаётся объектом { message: '...' }
const editSchema = z.object({
  fullName: z.string().min(2, { message: 'Минимум 2 символа' }),
  email: z.string().email({ message: 'Некорректный email' }),
  phone: z.string().min(5, { message: 'Введите телефон' }),
  address: z.string().min(2, { message: 'Введите адрес' }),
  company: z.string().min(2, { message: 'Введите компанию' }),
  description: z.string().optional(),
  avatar: z.string().optional(), // если пустое — оставляем старый аватар
});

type EditFormData = z.infer<typeof editSchema>;

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarError, setAvatarError] = useState(false); // ошибка загрузки превью

  const { data: client, isLoading, isError } = useGetClientByIdQuery(id);
  const [updateClient, { isLoading: isSaving }] = useUpdateClientMutation();
  const toast = useToast();

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
  });

  // Следим за полем avatar чтобы обновлять превью в реальном времени
  const watchedAvatar = watch('avatar', '');
  // Показываем новый URL если введён, иначе — аватар из базы
  const previewUrl = watchedAvatar?.trim() || client?.avatar || '';

  // Включаем режим редактирования — предзаполняем все поля текущими данными
  const handleStartEdit = () => {
    if (!client) return;
    reset({
      fullName: client.fullName,
      email: client.email,
      phone: client.contacts.phone,
      address: client.contacts.address,
      company: client.job.company,
      description: client.job.description,
      avatar: '', // оставляем пустым — так пользователь видит что можно менять
    });
    setAvatarError(false);
    setIsEditing(true);
  };

  const handleCancel = () => setIsEditing(false);

  const onSubmit = async (data: EditFormData) => {
    try {
      await updateClient({
        id,
        data: {
          fullName: data.fullName,
          email: data.email,
          // Если пользователь ввёл новый аватар — используем его, иначе оставляем старый
          avatar: data.avatar?.trim() ? data.avatar.trim() : client?.avatar,
          contacts: { phone: data.phone, address: data.address },
          job: { company: data.company, description: data.description ?? '' },
        },
      }).unwrap();
      toast.success('Данные клиента обновлены');
      setIsEditing(false);
    } catch {
      toast.error('Не удалось сохранить изменения');
    }
  };

  // --- Загрузка ---
  if (isLoading) {
    return (
      <div>
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-8" />
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />
            <div className="space-y-3">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- Ошибка ---
  if (isError || !client) {
    return (
      <div>
        <Link href="/dashboard/clients" className="text-blue-600 hover:underline text-sm mb-8 inline-block">
          ← Назад к клиентам
        </Link>
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <p className="text-gray-500 text-lg">Клиент не найден</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/dashboard/clients"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Назад к клиентам
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

        {/* Шапка карточки */}
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Аватар — в режиме просмотра показываем текущий, при редактировании — превью нового */}
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-sm shrink-0 bg-blue-100 flex items-center justify-center">
                {previewUrl && !avatarError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt={client.fullName}
                    className="w-full h-full object-cover"
                    onError={() => setAvatarError(true)}
                    onLoad={() => setAvatarError(false)}
                  />
                ) : null}
                {/* Fallback — инициалы если картинка не загрузилась */}
                <span className={`text-blue-700 font-bold text-xl absolute ${previewUrl && !avatarError ? 'opacity-0' : 'opacity-100'}`}>
                  {client.fullName.charAt(0)}
                </span>
                {/* Иконка-подсказка при редактировании */}
                {isEditing && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-full">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{client.fullName}</h2>
                <p className="text-blue-600 font-medium mt-1">{client.job.company}</p>
                <p className="text-gray-500 text-sm mt-0.5">Возраст: {client.age} лет</p>
              </div>
            </div>

            {!isEditing ? (
              <button
                onClick={handleStartEdit}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Редактировать
              </button>
            ) : (
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
            )}
          </div>
        </div>

        <div className="p-8">

          {/* ===== РЕЖИМ ПРОСМОТРА ===== */}
          {!isEditing && (
            <>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Контактная информация
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <InfoCard icon="email" label="Email" value={client.email} />
                <InfoCard icon="phone" label="Телефон" value={client.contacts.phone} />
                <InfoCard icon="address" label="Адрес" value={client.contacts.address} />
                <InfoCard icon="company" label="Компания" value={client.job.company} />
              </div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">О работе</h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700 text-sm leading-relaxed">{client.job.description}</p>
              </div>
            </>
          )}

          {/* ===== РЕЖИМ РЕДАКТИРОВАНИЯ ===== */}
          {isEditing && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Редактирование данных
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Поле аватара */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Фото профиля</label>
                  <input
                    {...register('avatar')}
                    placeholder="https://... (оставьте пустым чтобы не менять)"
                    className="input-field"
                    onChange={(e) => {
                      setAvatarError(false);
                      register('avatar').onChange(e);
                    }}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Превью обновляется выше. Оставьте пустым — аватар останется прежним.
                  </p>
                </div>

                {/* Имя */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Полное имя</label>
                  <input {...register('fullName')} className="input-field" />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input {...register('email')} type="email" className="input-field" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                {/* Телефон */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                  <input {...register('phone')} className="input-field" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                {/* Адрес */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Адрес</label>
                  <input {...register('address')} className="input-field" />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                </div>

                {/* Компания */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Компания</label>
                  <input {...register('company')} className="input-field" />
                  {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company.message}</p>}
                </div>

                {/* Описание */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Должность / описание</label>
                  <input {...register('description')} className="input-field" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={handleCancel}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Отмена
                </button>
                <button type="submit" disabled={isSaving}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
                  {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    email: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    phone: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
    address: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    company: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  };
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center gap-2 text-gray-400 mb-1">
        {icons[icon]}
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-gray-900 font-medium text-sm mt-1">{value}</p>
    </div>
  );
}