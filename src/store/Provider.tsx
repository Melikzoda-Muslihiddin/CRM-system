'use client';
// 'use client' нужно потому что Provider использует React Context
// Server Components не поддерживают Context — поэтому оборачиваем в Client Component

import { Provider } from 'react-redux';
import { store } from './index';

// ReduxProvider — оборачивает всё приложение, давая доступ к Redux store
// Используется в корневом layout.tsx
export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}