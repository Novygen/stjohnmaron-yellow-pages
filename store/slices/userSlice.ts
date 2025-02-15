import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  uid: string | null;
  email: string | null;
  displayName?: string | null;
  phoneNumber?: string | null;
  // You can add more fields as needed
  isAuthenticated: boolean;
}

const initialState: UserState = {
  uid: null,
  email: null,
  displayName: null,
  phoneNumber: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<Partial<UserState>>) {
      state.uid = action.payload.uid ?? null;
      state.email = action.payload.email ?? null;
      state.displayName = action.payload.displayName ?? null;
      state.phoneNumber = action.payload.phoneNumber ?? null;
      state.isAuthenticated = true;
    },
    clearUser(state) {
      state.uid = null;
      state.email = null;
      state.displayName = null;
      state.phoneNumber = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
