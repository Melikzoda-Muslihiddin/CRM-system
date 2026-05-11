// Redux Store — центральное хранилище всех данных приложения
//
// Три reducer-а:
//   auth       — данные авторизации (email, isAuthenticated)
//   toast      — список toast-уведомлений
//   clientsApi — кэш RTK Query (список клиентов, отдельные клиенты)

import { configureStore } from '@reduxjs/toolkit';
import { clientsApi } from '@/services/clientsApi';
import authReducer from '@/features/auth/authSlice';
import toastReducer from '@/store/toastSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    toast: toastReducer,
    // RTK Query требует добавить свой reducer под тем же ключом что указан в reducerPath
    [clientsApi.reducerPath]: clientsApi.reducer,
  },
  // RTK Query middleware управляет кэшем, инвалидацией и polling-ом
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(clientsApi.middleware),
});

// Типы для useSelector и useDispatch — TypeScript будет знать форму store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;