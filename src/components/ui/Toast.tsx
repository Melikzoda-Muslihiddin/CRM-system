'use client';
// Toast — контейнер с уведомлениями, фиксированный внизу-справа
// Каждый тост авто-закрывается через 3 секунды

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/index';
import { removeToast, Toast as ToastType } from '@/store/toastSlice';
import { cn } from '@/lib/utils';

// Один тост
function ToastItem({ toast }: { toast: ToastType }) {
  const dispatch = useDispatch();

  // Авто-удаление через 3 секунды
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, 3000);
    return () => clearTimeout(timer); // очищаем таймер если тост закрыли вручную
  }, [dispatch, toast.id]);

  const isSuccess = toast.type === 'success';

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium',
        'animate-in slide-in-from-right-5 fade-in duration-300',
        isSuccess ? 'bg-emerald-500' : 'bg-red-500'
      )}
    >
      {/* Иконка */}
      {isSuccess ? (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}

      <span>{toast.message}</span>

      {/* Кнопка ручного закрытия */}
      <button
        onClick={() => dispatch(removeToast(toast.id))}
        className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// Контейнер всех тостов — фиксированный внизу-справа
export default function ToastContainer() {
  const toasts = useSelector((state: RootState) => state.toast.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}