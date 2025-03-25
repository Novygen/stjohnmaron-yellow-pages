import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store';

interface AdminState {
  token: string | null;
  email: string | null;
  isAuthenticated: boolean;
}

const initialState: AdminState = {
  token: null,
  email: null,
  isAuthenticated: false,
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdminCredentials: (
      state,
      action: PayloadAction<{ token: string; email: string }>
    ) => {
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.isAuthenticated = true;
    },
    clearAdminCredentials: (state) => {
      state.token = null;
      state.email = null;
      state.isAuthenticated = false;
    },
    rehydrateAdmin: (state, action: PayloadAction<AdminState>) => {
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.isAuthenticated = action.payload.isAuthenticated;
    },
  },
});

export const { setAdminCredentials, clearAdminCredentials, rehydrateAdmin } = adminSlice.actions;

// Selectors
export const selectAdminToken = (state: RootState) => state.admin.token;
export const selectAdminEmail = (state: RootState) => state.admin.email;
export const selectIsAdminAuthenticated = (state: RootState) => state.admin.isAuthenticated;

export default adminSlice.reducer;
