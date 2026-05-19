import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/src/redux/store/store";

type TGeneralsState = {
  appliedJobIds: string[];
  savedJobIds: string[];
};

const initialState: TGeneralsState = {
  appliedJobIds: [],
  savedJobIds: [],
};

const generalsSlice = createSlice({
  name: "generals",
  initialState,
  reducers: {
    setAppliedJobIds: (state, action: PayloadAction<string[]>) => {
      state.appliedJobIds = action.payload;
    },
    setSavedJobIds: (state, action: PayloadAction<string[]>) => {
      state.savedJobIds = action.payload;
    },
    clearGenerals: (state) => {
      state.appliedJobIds = [];
      state.savedJobIds = [];
    },
  },
});

export const { setAppliedJobIds, setSavedJobIds, clearGenerals } =
  generalsSlice.actions;

export default generalsSlice.reducer;

export const selectAppliedJobIds = (state: RootState): string[] =>
  state.generals.appliedJobIds;
export const selectSavedJobIds = (state: RootState): string[] =>
  state.generals.savedJobIds;
