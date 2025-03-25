import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  uid: string | null;
  email: string | null;
  displayName?: string | null;
  phoneNumber?: string | null;
  token?: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  uid: null,
  email: null,
  displayName: null,
  phoneNumber: null,
  token: null,
  isAuthenticated: false,
};

// Helper function to save user data to localStorage
const saveUserToLocalStorage = (state: UserState) => {
  try {
    localStorage.setItem("user", JSON.stringify({
      uid: state.uid,
      email: state.email,
      displayName: state.displayName,
      phoneNumber: state.phoneNumber,
      isAuthenticated: state.isAuthenticated,
    }));
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<Partial<UserState>>) {
      state.uid = action.payload.uid ?? state.uid;
      state.email = action.payload.email ?? state.email;
      state.displayName = action.payload.displayName ?? state.displayName;
      state.phoneNumber = action.payload.phoneNumber ?? state.phoneNumber;
      state.token = action.payload.token ?? state.token;
      if (state.token) {
        localStorage.setItem("token", state.token);
      }
      state.isAuthenticated = true;
      saveUserToLocalStorage(state);
    },
    clearUser(state) {
      state.uid = null;
      state.email = null;
      state.displayName = null;
      state.phoneNumber = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      state.isAuthenticated = false;
    },
    updateUserEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
      saveUserToLocalStorage(state);
    },
    rehydrateUser(state, action: PayloadAction<UserState>) {
      const newState = { ...state, ...action.payload };
      saveUserToLocalStorage(newState);
      return newState;
    },
  },
});

export const { setUser, clearUser, updateUserEmail, rehydrateUser } = userSlice.actions;

export const selectUserUid = (state: { user: UserState }) => state.user.uid;
export const selectUserEmail = (state: { user: UserState }) => state.user.email;
export const selectIsAuthenticated = (state: { user: UserState }) => state.user.isAuthenticated;

export default userSlice.reducer;
