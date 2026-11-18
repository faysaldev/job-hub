import { configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  createMigrate,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  persistStore,
} from "redux-persist";
import authReducer from "@/src/redux/features/auth/authSlice";
import generalsReducer from "@/src/redux/features/generals/generalsSlice";
import storage from "redux-persist/lib/storage";
import { baseApi } from "@/src/redux/baseApi/baseApi";

const persistConfig = {
  key: "auth",
  storage,
  version: 2,
  // Public account details may be cached; access credentials must never be persisted.
  whitelist: ["user"],
  migrate: createMigrate({ 2: (state) => state ? { ...state, token: null,
    sessionChecked: false, sessionNotice: null } : state }, { debug: false }),
};
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: persistedAuthReducer,
    generals: generalsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware), // Make sure to concatenate the baseApi.middleware properly
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
