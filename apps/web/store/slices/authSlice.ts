import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type User = { sub: string; email: string; role?: string; organizationId?: string } | null;

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User;
}

const initialState: AuthState = {
  accessToken: (typeof window !== 'undefined' && localStorage.getItem('accessToken')) || null,
  refreshToken: (typeof window !== 'undefined' && localStorage.getItem('refreshToken')) || null,
  user: null,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens(state, action: PayloadAction<{ accessToken: string; refreshToken?: string; user?: User }>) {
      state.accessToken = action.payload.accessToken;
      if (typeof window !== 'undefined') localStorage.setItem('accessToken', action.payload.accessToken);
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
        if (typeof window !== 'undefined') localStorage.setItem('refreshToken', action.payload.refreshToken);
      }
      if (action.payload.user !== undefined) state.user = action.payload.user;
    },
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    },
  },
});

export const { setTokens, logout } = slice.actions;
export default slice.reducer;