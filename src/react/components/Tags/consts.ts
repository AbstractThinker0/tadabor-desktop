import { selectedChaptersType, verseProps } from "@/types";
import { ActionsUnion, createActionPayload } from "@/types/useReducer";

export interface tagProps {
  tagID: string;
  tagDisplay: string;
}

export interface tagsProps {
  [key: string]: tagProps;
}

export interface versesTagsProps {
  [key: string]: string[];
}

export interface tagsStateProps {
  currentChapter: number;
  selectedChapters: selectedChaptersType;
  tags: tagsProps;
  currentTag: tagProps | null;
  versesTags: versesTagsProps;
  currentVerse: verseProps | null;
  selectedTags: tagsProps;
  scrollKey: string;
}

export enum TAGS_ACTIONS {
  SET_CHAPTER = "dispatchSetChapter",
  SET_SELECTED_CHAPTERS = "dispatchSetSelectedChapters",
  TOGGLE_SELECT_CHAPTER = "dispatchToggleSelectChapter",
  ADD_TAG = "dispatchAddTage",
  SET_TAGS = "dispatchSetTags",
  SET_CURRENT_TAG = "dispatchSetCurrentTag",
  DELETE_TAG = "dispatchActionDeleteTag",
  SET_CURRENT_VERSE = "dispatchSetCurrentVerse",
  SET_VERSE_TAGS = "dispatchSetVerseTags",
  SET_VERSES_TAGS = "dispatchSetVersesTags",
  SELECT_TAG = "dispatchSelectTag",
  DESELECT_TAG = "dispatchDeselectTag",
  GOTO_CHAPTER = "dispatchGotoChapter",
  SET_SCROLL_KEY = "dispatchSetScrollKey",
}

export const tagsActions = {
  setChapter: createActionPayload<TAGS_ACTIONS.SET_CHAPTER, number>(
    TAGS_ACTIONS.SET_CHAPTER
  ),
  setSelectedChapters: createActionPayload<
    TAGS_ACTIONS.SET_SELECTED_CHAPTERS,
    selectedChaptersType
  >(TAGS_ACTIONS.SET_SELECTED_CHAPTERS),
  toggleSelectChapter: createActionPayload<
    TAGS_ACTIONS.TOGGLE_SELECT_CHAPTER,
    number
  >(TAGS_ACTIONS.TOGGLE_SELECT_CHAPTER),
  addTag: createActionPayload<TAGS_ACTIONS.ADD_TAG, tagProps>(
    TAGS_ACTIONS.ADD_TAG
  ),
  setTags: createActionPayload<TAGS_ACTIONS.SET_TAGS, tagsProps>(
    TAGS_ACTIONS.SET_TAGS
  ),
  setCurrentTag: createActionPayload<TAGS_ACTIONS.SET_CURRENT_TAG, tagProps>(
    TAGS_ACTIONS.SET_CURRENT_TAG
  ),
  deleteTag: createActionPayload<TAGS_ACTIONS.DELETE_TAG, string>(
    TAGS_ACTIONS.DELETE_TAG
  ),
  setCurrentVerse: createActionPayload<
    TAGS_ACTIONS.SET_CURRENT_VERSE,
    verseProps | null
  >(TAGS_ACTIONS.SET_CURRENT_VERSE),
  setVerseTags: createActionPayload<
    TAGS_ACTIONS.SET_VERSE_TAGS,
    { verseKey: string; tags: string[] | null }
  >(TAGS_ACTIONS.SET_VERSE_TAGS),
  setVersesTags: createActionPayload<
    TAGS_ACTIONS.SET_VERSES_TAGS,
    versesTagsProps
  >(TAGS_ACTIONS.SET_VERSES_TAGS),
  selectTag: createActionPayload<TAGS_ACTIONS.SELECT_TAG, tagProps>(
    TAGS_ACTIONS.SELECT_TAG
  ),
  deselectTag: createActionPayload<TAGS_ACTIONS.DESELECT_TAG, string>(
    TAGS_ACTIONS.DESELECT_TAG
  ),
  gotoChapter: createActionPayload<TAGS_ACTIONS.GOTO_CHAPTER, string>(
    TAGS_ACTIONS.GOTO_CHAPTER
  ),
  setScrollKey: createActionPayload<TAGS_ACTIONS.SET_SCROLL_KEY, string>(
    TAGS_ACTIONS.SET_SCROLL_KEY
  ),
};

export type tagsActionsProps = ActionsUnion<typeof tagsActions>;
