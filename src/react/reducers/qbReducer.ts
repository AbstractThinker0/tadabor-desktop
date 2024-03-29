import {
  QB_ACTIONS,
  qbStateProps,
  qbActionsProps,
} from "../components/QuranBrowser/consts";
import { qbSearchRoot } from "./qbActionSearchRoot";
import { qbSearchWord } from "./qbActionSearchWord";

function qbReducer(state: qbStateProps, action: qbActionsProps): qbStateProps {
  // ...
  switch (action.type) {
    case QB_ACTIONS.SET_SELECTED_CHAPTERS: {
      return { ...state, selectedChapters: action.payload };
    }
    case QB_ACTIONS.SET_SEARCH_STRING: {
      return { ...state, searchString: action.payload };
    }
    case QB_ACTIONS.SET_SEARCH_DIACRITICS: {
      return { ...state, searchDiacritics: action.payload };
    }
    case QB_ACTIONS.SET_SEARCH_IDENTICAL: {
      return { ...state, searchIdentical: action.payload };
    }
    case QB_ACTIONS.SET_SEARCH_METHOD: {
      return { ...state, searchMethod: action.payload };
    }
    case QB_ACTIONS.SEARCH_ROOT_SUBMIT: {
      return qbSearchRoot(state, action.payload);
    }
    case QB_ACTIONS.SEARCH_WORD_SUBMIT: {
      return qbSearchWord(state, action.payload);
    }
    case QB_ACTIONS.GOTO_CHAPTER: {
      return {
        ...state,
        searchError: false,
        searchResult: [],
        searchIndexes: [],
        selectChapter: Number(action.payload),
        scrollKey: "",
      };
    }
    case QB_ACTIONS.SET_SCROLL_KEY: {
      const newKey = state.scrollKey === action.payload ? "" : action.payload;
      return { ...state, scrollKey: newKey };
    }
  }
}

export default qbReducer;
