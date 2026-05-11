'use client';
// useToast — удобный хук для показа уведомлений из любого компонента
//
// Использование:
//   const toast = useToast();
//   toast.success('Клиент удалён');
//   toast.error('Не удалось удалить');

import { useDispatch } from 'react-redux';
import { showToast } from '@/store/toastSlice';

export function useToast() {
  const dispatch = useDispatch();

  return {
    success: (message: string) => dispatch(showToast({ message, type: 'success' })),
    error: (message: string) => dispatch(showToast({ message, type: 'error' })),
  };
}