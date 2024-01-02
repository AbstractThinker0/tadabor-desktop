import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import verseNotesReducer from "./slices/verseNotes";
import transNotesReducer from "./slices/transNotes";
import rootNotesReducer from "./slices/rootNotes";
import searcherPageReducer from "./slices/searcherPage";

const store = configureStore({
  reducer: {
    verseNotes: verseNotesReducer,
    transNotes: transNotesReducer,
    rootNotes: rootNotesReducer,
    searcherPage: searcherPageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch; // Export a hook that can be reused to resolve types
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const selectNote = (key: string) => {
  return (state: RootState) => state.verseNotes.data[key];
};

export const getAllNotes = () => {
  return (state: RootState) => state.verseNotes.data;
};

export const selectTranslation = (key: string) => {
  return (state: RootState) => state.transNotes.data[key];
};

export const selecRootNote = (key: string) => {
  return (state: RootState) => state.rootNotes.data[key];
};

export const getAllRootNotes = () => {
  return (state: RootState) => state.rootNotes.data;
};

export const isDataLoading = () => {
  return (state: RootState) =>
    state.rootNotes.loading &&
    state.transNotes.loading &&
    state.verseNotes.loading;
};

export default store;
