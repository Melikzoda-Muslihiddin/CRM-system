'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAddClientMutation } from '@/services/clientsApi';
import { useToast } from '@/hooks/useToast';

const addClientSchema = z.object({
  fullName: z.string().min(2, { message: 'Минимум 2 символа' }),
  email: z.string().email({ message: 'Некорректный email' }),
  age: z.string().optional(),
  phone: z.string().min(5, { message: 'Введите телефон' }),
  address: z.string().min(2, { message: 'Введите адрес' }),
  company: z.string().min(2, { message: 'Введите компанию' }),
  description: z.string().optional(),
  avatar: z.string().optional(),
});

type AddClientFormData = z.infer<typeof addClientSchema>;

interface AddClientModalProps {
  onClose: () => void;
}

export default function AddClientModal({ onClose }: AddClientModalProps) {
  const [addClient, { isLoading }] = useAddClientMutation();
  const toast = useToast();

  // Локальный стейт для превью аватара — обновляется при вводе URL
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarError, setAvatarError] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AddClientFormData>({
    resolver: zodResolver(addClientSchema),
  });

  // Следим за полем email чтобы показать авто-аватар когда поле avatar пустое
  const watchedEmail = watch('email', '');
  const watchedAvatar = watch('avatar', '');

  // Что показываем в превью: введённый URL или авто по email
  const previewUrl = watchedAvatar?.trim()
    ? watchedAvatar.trim()
    : watchedEmail
      ? `https://i.pravatar.cc/150?u=${encodeURIComponent(watchedEmail)}`
      : '';

  const onSubmit = async (data: AddClientFormData) => {
    try {
      // Если поле аватара заполнено — используем его, иначе генерируем по email
      const avatar = data.avatar?.trim()
        ? data.avatar.trim()
        : `https://i.pravatar.cc/150?u=${encodeURIComponent(data.email)}`;

      await addClient({
        fullName: data.fullName,
        email: data.email,
        age: parseInt(data.age ?? '0') || 0,
        avatar,
        contacts: { phone: data.phone, address: data.address },
        job: { company: data.company, description: data.description ?? '' },
      }).unwrap();

      toast.success(`${data.fullName} успешно добавлен`);
      onClose();
    } catch {
      toast.error('Не удалось добавить клиента');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Шапка */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">Новый клиент</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">

          {/* Блок аватара с превью */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Фото профиля</label>
            <div className="flex items-center gap-4">
              {/* Превью аватара */}
              <div className="w-16 h-16 rounded-full bg-blue-100 overflow-hidden flex items-center justify-center shrink-0 border-2 border-gray-100">
                {previewUrl && !avatarError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="w-full h-full object-cover"
                    onError={() => setAvatarError(true)}
                    onLoad={() => setAvatarError(false)}
                  />
                ) : (
                  <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              {/* Поле URL */}
              <div className="flex-1">
                <input
                  {...register('avatar')}
                  placeholder="https://... (оставьте пустым для авто)"
                  className="input-field"
                  onChange={(e) => {
                    setAvatarError(false);
                    setAvatarPreview(e.target.value);
                    // Передаём значение в react-hook-form
                    register('avatar').onChange(e);
                  }}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Если пустое — аватар сгенерируется автоматически по email
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Имя */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Полное имя *</label>
              <input {...register('fullName')} placeholder="Иван Иванов" className="input-field" />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input {...register('email')} type="email" placeholder="ivan@mail.com" className="input-field" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Возраст */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Возраст</label>
              <input {...register('age')} type="number" placeholder="30" className="input-field" />
            </div>

            {/* Телефон */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Телефон *</label>
              <input {...register('phone')} placeholder="+7 999 000-00-00" className="input-field" />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            {/* Адрес */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Адрес *</label>
              <input {...register('address')} placeholder="Москва" className="input-field" />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>

            {/* Компания */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Компания *</label>
              <input {...register('company')} placeholder="ООО Пример" className="input-field" />
              {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company.message}</p>}
            </div>

            {/* Описание */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Должность / описание</label>
              <input {...register('description')} placeholder="Frontend Developer" className="input-field" />
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Отмена
            </button>
            <button type="submit" disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
              {isLoading ? 'Сохранение...' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}