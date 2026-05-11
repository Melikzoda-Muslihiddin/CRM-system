// authSlice — управляет состоянием авторизации во всём приложении
// createSlice создаёт reducer + actions одновременно

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Форма состояния авторизации
interface AuthState {
  isAuthenticated: boolean;
  userEmail: string | null;
}

// Начальное состояние — пользователь не авторизован
const initialState: AuthState = {
  isAuthenticated: false,
  userEmail: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // login — вызывается при входе, сохраняет email
    login: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = true;
      state.userEmail = action.payload;
    },
    // logout — вызывается при выходе, сбрасывает состояние
    logout: (state) => {
      state.isAuthenticated = false;
      state.userEmail = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;