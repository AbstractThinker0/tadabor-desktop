import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { translationsProps } from "@/types";

/*
interface transListProps {
  [key: string]: { url: string };
}

const transList: transListProps = {
  "Muhammad Asad": { url: "/trans/Muhammad Asad v3.json" },
  "The Monotheist Group": { url: "/trans/The Monotheist Group.json" },
};
*/

// Create a single async thunk for multiple fetch requests
export const fetchAllTranslations = createAsyncThunk(
  "translations/fetchAllTranslations",
  async () => {
    const transData: translationsProps = {};

    transData["Muhammad Asad"] = (
      await import("../../../data/trans/Muhammad Asad v3.json")
    ).default;
    transData["The Monotheist Group"] = (
      await import("../../../data/trans/The Monotheist Group.json")
    ).default;

    return { transData };
  }
);

const translationsSlice = createSlice({
  name: "translations",
  initialState: {
    error: false,
    loading: false,
    complete: false,
    data: {} as translationsProps,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTranslations.fulfilled, (state, action) => {
        state.loading = false;
        state.complete = true;
        state.data = action.payload.transData;
      })
      .addCase(fetchAllTranslations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllTranslations.rejected, (state) => {
        state.error = true;
      });
  },
});

export const translationsActions = translationsSlice.actions;

export default translationsSlice.reducer;
