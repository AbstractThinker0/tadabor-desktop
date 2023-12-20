import { qbStateProps } from "@/components/QuranBrowser/consts";
import { chapterProps, quranProps, verseMatchResult } from "@/types";
import { searchVerse, onlySpaces, removeDiacritics } from "@/util/util";

export function qbSearchWord(
  state: qbStateProps,
  chapterNames: chapterProps[],
  allQuranText: quranProps[]
): qbStateProps {
  const {
    searchString,
    searchMethod,
    selectChapter,
    selectedChapters,
    searchDiacritics,
    searchIdentical,
  } = state;
  // initial search state
  const newState: qbStateProps = {
    ...state,
    searchError: false,
    searchResult: [],
    searchIndexes: [],
    searchingString: searchString,
    searchingMethod: searchMethod,
    searchingChapters: selectedChapters.map(
      (chapterID) => chapterNames[Number(chapterID) - 1].name
    ),
    scrollKey: "",
  };

  if (onlySpaces(searchString)) {
    return { ...newState, searchError: true };
  }

  const normalizedToken = searchDiacritics
    ? searchString
    : removeDiacritics(searchString);

  if (onlySpaces(normalizedToken)) {
    return { ...newState, searchError: true };
  }

  const matchVerses: verseMatchResult[] = [];

  if (selectedChapters.length === 114) {
    allQuranText.forEach((sura) => {
      sura.verses.forEach((verse) => {
        const result = searchVerse(
          verse,
          normalizedToken,
          searchIdentical,
          searchDiacritics
        );

        if (result) {
          matchVerses.push(result);
        }
      });
    });
  } else {
    if (selectedChapters.length > 1) {
      selectedChapters.forEach((chapter) => {
        allQuranText[Number(chapter) - 1].verses.forEach((verse) => {
          const result = searchVerse(
            verse,
            normalizedToken,
            searchIdentical,
            searchDiacritics
          );

          if (result) {
            matchVerses.push(result);
          }
        });
      });
    } else {
      allQuranText[selectChapter - 1].verses.forEach((verse) => {
        const result = searchVerse(
          verse,
          normalizedToken,
          searchIdentical,
          searchDiacritics
        );

        if (result) {
          matchVerses.push(result);
        }
      });
    }
  }

  if (matchVerses.length === 0) {
    return { ...newState, searchError: true };
  }

  return {
    ...newState,
    searchResult: matchVerses,
  };
}
