import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/src/redux/store/store";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  image: string | null;
  role: "seeker" | "recruiter" | "admin";
  phoneNumber?: string;
  isEmailVerified?: boolean;
  isProfileCompleted?: boolean;
  isVerified?: boolean;
  createdAt: string;
}

type TAuthState = {
  user: AuthUser | null;
  token: string | null;
  sessionChecked: boolean;
  sessionNotice: string | null;
};

const initialState: TAuthState = {
  user: null,
  token: null,
  sessionChecked: false,
  sessionNotice: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: AuthUser; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.sessionChecked = true;
      state.sessionNotice = null;
    },
    setSessionChecked: (state) => { state.sessionChecked = true; },
    sessionExpired: (state, action: PayloadAction<string | undefined>) => {
      state.user = null;
      state.token = null;
      state.sessionChecked = true;
      state.sessionNotice = action.payload || "Your session expired. Please sign in again.";
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.sessionChecked = true;
      state.sessionNotice = null;
    },
    clearSessionNotice: (state) => { state.sessionNotice = null; },
  },
});

export const { setUser, setSessionChecked, sessionExpired, logout, clearSessionNotice } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state: RootState): AuthUser | null => state.auth.user;
export const selectToken = (state: RootState): string | null => state.auth.token;
export const selectSessionChecked = (state: RootState): boolean => state.auth.sessionChecked;
