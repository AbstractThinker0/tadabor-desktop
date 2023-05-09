import { useEffect, useRef, Dispatch } from "react";
import useQuran from "../../context/QuranContext";
import AddColorModal from "./AddColorModal";
import DeleteColorModal from "./DeleteColorModal";
import EditColorsModal from "./EditColorsModal";
import { clActions, clActionsProps, colorProps, coloredProps } from "./consts";
import { getTextColor } from "./util";
import { dbFuncs } from "../../util/db";
import { selectedChaptersType } from "../../types";

interface ChaptersSideProps {
  currentChapter: number;
  chapterToken: string;
  colorsList: coloredProps;
  currentColor: colorProps | null;
  coloredVerses: coloredProps;
  selectedChapters: selectedChaptersType;
  dispatchClAction: Dispatch<clActionsProps>;
}

function ChaptersSide({
  currentChapter,
  chapterToken,
  colorsList,
  currentColor,
  coloredVerses,
  selectedChapters,
  dispatchClAction,
}: ChaptersSideProps) {
  const { chapterNames } = useQuran();
  const refChapter = useRef<HTMLDivElement | null>(null);

  function onClickChapter(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    chapterID: number
  ) {
    dispatchClAction(clActions.setChapter(chapterID));
    dispatchClAction(clActions.setChapterToken(""));

    document.documentElement.scrollTop = 0;

    refChapter.current = event.currentTarget;
  }

  useEffect(() => {
    const child = refChapter.current;
    const parent = refChapter.current?.parentElement?.parentElement;

    if (!child || !parent) return;

    const parentOffsetTop = parent.offsetTop;

    if (
      parent.scrollTop + parentOffsetTop <
        child.offsetTop - parent.clientHeight + child.clientHeight * 2.5 ||
      parent.scrollTop + parentOffsetTop >
        child.offsetTop - child.clientHeight * 2.5
    ) {
      parent.scrollTop =
        child.offsetTop - parentOffsetTop - parent.clientHeight / 2;
    }
  }, [currentChapter]);

  function onChangeChapterToken(event: React.ChangeEvent<HTMLInputElement>) {
    dispatchClAction(clActions.setChapterToken(event.target.value));
  }

  function onClickSelectColor(color: colorProps) {
    dispatchClAction(clActions.selectColor(color));
  }

  function onClickDeleteColor(color: colorProps) {
    dispatchClAction(clActions.setCurrentColor(color));
  }

  function deleteColor(colorID: string) {
    dispatchClAction(clActions.deleteColor(colorID));
    dbFuncs.deleteColor(colorID);

    for (const verseKey in coloredVerses) {
      if (coloredVerses[verseKey].colorID === colorID) {
        dbFuncs.deleteVerseColor(verseKey);
      }
    }
  }

  function addColor(color: colorProps) {
    dispatchClAction(clActions.addColor(color));
  }

  function setColorsList(colorsList: coloredProps) {
    dispatchClAction(clActions.setColorsList(colorsList));

    Object.keys(colorsList).forEach((colorID) => {
      dbFuncs.saveColor({
        id: colorsList[colorID].colorID,
        name: colorsList[colorID].colorDisplay,
        code: colorsList[colorID].colorCode,
      });
    });

    const newColoredVerses: coloredProps = {};
    Object.keys(coloredVerses).forEach((verseKey) => {
      newColoredVerses[verseKey] = colorsList[coloredVerses[verseKey].colorID];
    });

    dispatchClAction(clActions.setColoredVerses(newColoredVerses));
  }

  function onChangeSelectChapter(chapterID: number) {
    dispatchClAction(clActions.toggleSelectChapter(chapterID));
  }

  function onClickSelectAll() {
    const selectedChapters: selectedChaptersType = {};

    chapterNames.forEach((chapter) => {
      selectedChapters[chapter.id] = true;
    });

    dispatchClAction(clActions.setSelectedChapters(selectedChapters));
  }

  function onClickDeselectAll() {
    const selectedChapters: selectedChaptersType = {};

    chapterNames.forEach((chapter) => {
      selectedChapters[chapter.id] = false;
    });

    dispatchClAction(clActions.setSelectedChapters(selectedChapters));
  }

  function getSelectedCount() {
    return Object.keys(selectedChapters).filter(
      (chapterID) => selectedChapters[chapterID] === true
    ).length;
  }

  return (
    <div className="chapters-side">
      <div className="chapter-block">
        <input
          className="chapter-search"
          type="text"
          placeholder={chapterNames[currentChapter - 1].name}
          value={chapterToken}
          onChange={onChangeChapterToken}
        />
        <div className="chapter-list">
          {chapterNames
            .filter((chapter) => chapter.name.includes(chapterToken))
            .map((chapter) => (
              <div
                key={chapter.id}
                className={`chapter-list-item ${
                  currentChapter === chapter.id
                    ? "chapter-list-item-selected"
                    : ""
                }`}
              >
                <div
                  className="chapter-list-item-name"
                  onClick={(event) => onClickChapter(event, chapter.id)}
                >
                  {chapter.name}
                </div>

                <input
                  type="checkbox"
                  checked={
                    selectedChapters[chapter.id] !== undefined
                      ? selectedChapters[chapter.id]
                      : true
                  }
                  onChange={() => onChangeSelectChapter(chapter.id)}
                />
              </div>
            ))}
        </div>
        <div className="chapter-block-buttons" dir="ltr">
          <button
            disabled={getSelectedCount() === 114}
            onClick={onClickSelectAll}
            className="btn btn-dark btn-sm"
          >
            Select all
          </button>
          <button
            disabled={getSelectedCount() === 0}
            onClick={onClickDeselectAll}
            className="btn btn-dark btn-sm"
          >
            Deselect all
          </button>
        </div>
      </div>
      <div className="chapters-side-colors-block">
        <div className="text-center" dir="ltr">
          Colors list:
        </div>
        {Object.keys(colorsList).length > 0 && (
          <div className="chapters-side-colors" dir="ltr">
            {Object.keys(colorsList).map((colorID) => (
              <div
                key={colorsList[colorID].colorID}
                className="chapters-side-colors-item text-center rounded mb-1"
                style={{
                  backgroundColor: colorsList[colorID].colorCode,
                  color: getTextColor(colorsList[colorID].colorCode),
                }}
              >
                <div
                  onClick={() => onClickSelectColor(colorsList[colorID])}
                  className="opacity-0"
                >
                  🗑️
                </div>
                <div
                  className="flex-grow-1 chapters-side-colors-item-text"
                  onClick={() => onClickSelectColor(colorsList[colorID])}
                >
                  {colorsList[colorID].colorDisplay}
                </div>
                <div
                  data-bs-toggle="modal"
                  data-bs-target="#deleteColorModal"
                  onClick={() => onClickDeleteColor(colorsList[colorID])}
                >
                  🗑️
                </div>
              </div>
            ))}
          </div>
        )}
        <DeleteColorModal
          currentColor={currentColor}
          deleteColor={deleteColor}
          versesCount={
            Object.keys(coloredVerses).filter((verseKey) => {
              return coloredVerses[verseKey]?.colorID === currentColor?.colorID;
            }).length
          }
        />
        <div className="text-center d-flex gap-2" dir="ltr">
          <button
            className="btn btn-dark mt-1"
            data-bs-toggle="modal"
            data-bs-target="#colorsModal"
          >
            New color
          </button>
          <button
            className="btn btn-info mt-1"
            data-bs-toggle="modal"
            data-bs-target="#editColorsModal"
          >
            Edit colors
          </button>
        </div>
        <AddColorModal addColor={addColor} />
        <EditColorsModal
          colorsList={{ ...colorsList }}
          setColorsList={setColorsList}
        />
      </div>
    </div>
  );
}

export default ChaptersSide;