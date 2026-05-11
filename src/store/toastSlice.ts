// toastSlice — управляет списком уведомлений (toast-сообщений)
// Тосты хранятся в Redux чтобы можно было вызвать из любого компонента

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

interface ToastState {
  toasts: Toast[];
}

const initialState: ToastState = {
  toasts: [],
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    // Добавляет новый тост в список
    showToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const id = Date.now().toString(); // уникальный id по времени
      state.toasts.push({ ...action.payload, id });
    },
    // Удаляет тост по id (вызывается автоматически через 3 сек)
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { showToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;