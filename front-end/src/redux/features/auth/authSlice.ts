import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/src/redux/store/store";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  image: string | null;
  role: "jobseeker" | "recruiter" | "admin";
  phoneNumber?: string;
  isProfileCompleted: boolean;
  isVerified: boolean;
  createdAt: string;
}

type TAuthState = {
  user: AuthUser | null;
  token: string | null;
};

const initialState: TAuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ user: AuthUser; token: string }>,
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState): AuthUser | null =>
  state.auth.user;
export const selectToken = (state: RootState): string | null =>
  state.auth.token;
