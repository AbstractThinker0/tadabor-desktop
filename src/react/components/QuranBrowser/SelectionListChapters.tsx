import { memo, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import useQuran from "@/context/useQuran";
import { selectedChaptersType } from "@/types";

interface SelectionListChaptersProps {
  currentChapter: number;
  handleSelectedChapters: (selectedChapters: string[]) => void;
  handleCurrentChapter: (chapterID: number) => void;
}

const SelectionListChapters = memo(
  ({
    currentChapter,
    handleSelectedChapters,
    handleCurrentChapter,
  }: SelectionListChaptersProps) => {
    const quranService = useQuran();
    const { t } = useTranslation();

    const [chapterSearch, setChapterSearch] = useState("");

    const [selectionChapters, setSelectionChapters] = useState(() => {
      const initialSelectionChapters: selectedChaptersType = {};

      quranService.chapterNames.forEach((chapter) => {
        initialSelectionChapters[chapter.id] = true;
      });

      return initialSelectionChapters;
    });

    const refChaptersList = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const parent = refChaptersList.current;

      if (!parent) return;

      const selectedChapter = parent.querySelector(
        `[data-id="${currentChapter}"]`
      ) as HTMLDivElement;

      if (!selectedChapter) return;

      const parentOffsetTop = parent.offsetTop;

      if (
        parent.scrollTop + parentOffsetTop <
          selectedChapter.offsetTop -
            parent.clientHeight +
            selectedChapter.clientHeight * 1.7 ||
        parent.scrollTop + parentOffsetTop >
          selectedChapter.offsetTop - selectedChapter.clientHeight * 1.1
      ) {
        parent.scrollTop =
          selectedChapter.offsetTop - parentOffsetTop - parent.clientHeight / 2;
      }
    });

    const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      setChapterSearch(event.target.value);
    };

    const onClickChapter = (chapterID: number) => {
      handleCurrentChapter(chapterID);
    };

    const onClickSelectAll = () => {
      const newSelectionChapters: selectedChaptersType = {};

      quranService.chapterNames.forEach((chapter) => {
        newSelectionChapters[chapter.id] = true;
      });

      setSelectionChapters(newSelectionChapters);

      handleSelectedChapters(
        Array.from(quranService.chapterNames, (chapter) =>
          chapter.id.toString()
        )
      );
    };

    const onClickDeselectAll = () => {
      const newSelectionChapters: selectedChaptersType = {};

      quranService.chapterNames.forEach((chapter) => {
        newSelectionChapters[chapter.id] = false;
      });

      newSelectionChapters[currentChapter] = true;

      setSelectionChapters(newSelectionChapters);

      handleSelectedChapters([currentChapter.toString()]);
    };

    const onChangeSelectChapter = (chapterID: number) => {
      const newSelectionChapters: selectedChaptersType = {
        ...selectionChapters,
        [chapterID]: !selectionChapters[chapterID],
      };

      setSelectionChapters(newSelectionChapters);

      handleSelectedChapters(
        Object.keys(newSelectionChapters).filter(
          (chapter) => newSelectionChapters[chapter] === true
        )
      );
    };

    const selectedChapters = Object.keys(selectionChapters).filter(
      (chapterID) => selectionChapters[chapterID] === true
    );

    const getSelectedCount = selectedChapters.length;

    const onlyCurrentSelected =
      getSelectedCount === 1 && Number(selectedChapters[0]) === currentChapter;

    return (
      <div className="container p-0 browser-search-chapter">
        <input
          className="form-control browser-search-chapter-input"
          type="search"
          value={chapterSearch}
          onChange={onChangeInput}
          placeholder={quranService.getChapterName(currentChapter)}
          aria-label="Search"
          dir="rtl"
        />
        <div className="browser-search-chapter-list" ref={refChaptersList}>
          {quranService.chapterNames
            .filter((chapter) => chapter.name.includes(chapterSearch))
            .map((chapter) => (
              <div
                key={chapter.id}
                data-id={chapter.id}
                className={`browser-search-chapter-list-item ${
                  currentChapter === chapter.id
                    ? "browser-search-chapter-list-item-selected"
                    : ""
                }`}
              >
                <div
                  className={"browser-search-chapter-list-item-name"}
                  onClick={() => onClickChapter(chapter.id)}
                >
                  {chapter.id}. {chapter.name}
                </div>
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={selectionChapters[chapter.id]}
                  onChange={() => onChangeSelectChapter(chapter.id)}
                />
              </div>
            ))}
        </div>
        <div className="browser-search-chapter-footer">
          <div className="text-center fw-bold">{t("search_scope")}:</div>
          <div className="browser-search-chapter-footer-buttons">
            <button
              disabled={getSelectedCount === 114}
              onClick={onClickSelectAll}
              className="btn btn-dark btn-sm"
            >
              {t("all_chapters")}
            </button>
            <button
              disabled={onlyCurrentSelected}
              onClick={onClickDeselectAll}
              className="btn btn-dark btn-sm"
            >
              {t("current_chapter")}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

SelectionListChapters.displayName = "SelectionListChapters";

export default SelectionListChapters;
