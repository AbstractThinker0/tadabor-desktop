import {
  Dispatch,
  memo,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";

import { selectedChaptersType, verseProps } from "@/types";
import useQuran from "@/context/useQuran";
import { dbFuncs } from "@/util/db";

import { ExpandButton } from "@/components/Generic/Buttons";
import NoteText from "@/components/Custom/NoteText";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import {
  tagsActions,
  tagsActionsProps,
  tagsProps,
  versesTagsProps,
} from "./consts";
import VerseTagsModal from "./VerseTagsModal";

interface TagsDisplayProps {
  selectedTags: tagsProps;
  selectedChapters: selectedChaptersType;
  tags: tagsProps;
  versesTags: versesTagsProps;
  currentChapter: number;
  currentVerse: verseProps | null;
  scrollKey: string;
  dispatchTagsAction: Dispatch<tagsActionsProps>;
}

function TagsDisplay({
  selectedTags,
  selectedChapters,
  tags,
  versesTags,
  currentChapter,
  currentVerse,
  scrollKey,
  dispatchTagsAction,
}: TagsDisplayProps) {
  const quranService = useQuran();

  function onClickDeleteSelected(tagID: string) {
    dispatchTagsAction(tagsActions.deselectTag(tagID));
  }

  const chaptersScope = Object.keys(selectedChapters).filter(
    (chapterID) => selectedChapters[chapterID] === true
  );

  const asArray = Object.entries(versesTags);

  const filtered = asArray.filter(([key]) => {
    const info = key.split("-");
    return selectedChapters[info[0]] === true;
  });

  const selectedVerses = Object.fromEntries(filtered);

  function setCurrentVerse(verse: verseProps | null) {
    dispatchTagsAction(tagsActions.setCurrentVerse(verse));
  }

  function setVerseTags(verseKey: string, tags: string[] | null) {
    if (tags === null) {
      dbFuncs.deleteVerseTags(verseKey);
    } else {
      dbFuncs.saveVerseTags({ verse_key: verseKey, tags_ids: tags });
    }

    dispatchTagsAction(tagsActions.setVerseTags({ verseKey, tags }));
  }

  return (
    <div className="tags-display">
      {Object.keys(selectedTags).length > 0 && (
        <>
          <div className="tags-display-tags" dir="ltr">
            <div className="fw-bold">Selected tags:</div>
            <div className="tags-display-tags-list">
              {Object.keys(selectedTags).map((tagID) => (
                <div key={tagID} className="tags-display-tags-list-item">
                  {selectedTags[tagID].tagDisplay}
                  <div
                    onClick={() => onClickDeleteSelected(tagID)}
                    className="tags-display-tags-list-item-close"
                  >
                    X
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="tags-display-chapters" dir="ltr">
            <div className="fw-bold">Selected chapters:</div>
            {chaptersScope.length === 114 ? (
              <div className="fw-bold">All chapters.</div>
            ) : chaptersScope.length === 0 ? (
              <div className="fw-bold">No chapters selected.</div>
            ) : (
              chaptersScope.map((chapterID) => (
                <div className="tags-display-chapters-item" key={chapterID}>
                  {quranService.getChapterName(chapterID)}
                </div>
              ))
            )}
          </div>
        </>
      )}
      <div className="card tags-display-chapter" dir="rtl">
        {Object.keys(selectedTags).length ? (
          chaptersScope.length ? (
            <SelectedVerses
              selectedTags={selectedTags}
              tags={tags}
              versesTags={selectedVerses}
              dispatchTagsAction={dispatchTagsAction}
            />
          ) : (
            <div className="text-center" dir="ltr">
              You have to select at least one chapter.
            </div>
          )
        ) : (
          <ListVerses
            currentChapter={currentChapter}
            versesTags={versesTags}
            tags={tags}
            scrollKey={scrollKey}
            dispatchTagsAction={dispatchTagsAction}
          />
        )}
      </div>
      <VerseTagsModal
        tags={tags}
        currentVerse={currentVerse}
        setCurrentVerse={setCurrentVerse}
        setVerseTags={setVerseTags}
        verseTags={
          currentVerse
            ? versesTags[currentVerse.key]
              ? versesTags[currentVerse.key]
              : null
            : null
        }
      />
    </div>
  );
}

interface SelectedVersesProps {
  selectedTags: tagsProps;
  tags: tagsProps;
  versesTags: versesTagsProps;
  dispatchTagsAction: Dispatch<tagsActionsProps>;
}

function SelectedVerses({
  selectedTags,
  versesTags,
  tags,
  dispatchTagsAction,
}: SelectedVersesProps) {
  const quranService = useQuran();

  const selectedVerses = Object.keys(versesTags).filter((verseKey) =>
    Object.keys(selectedTags).some((tagID) =>
      versesTags[verseKey].includes(tagID)
    )
  );

  const sortedVerses = selectedVerses.sort((keyA, KeyB) => {
    const infoA = keyA.split("-");
    const infoB = KeyB.split("-");
    if (Number(infoA[0]) !== Number(infoB[0]))
      return Number(infoA[0]) - Number(infoB[0]);
    else return Number(infoA[1]) - Number(infoB[1]);
  });

  function handleClickVerse(verse: verseProps) {
    dispatchTagsAction(tagsActions.gotoChapter(verse.suraid));
    dispatchTagsAction(tagsActions.setScrollKey(verse.key));
  }

  return (
    <div className="card-body">
      {sortedVerses.length ? (
        <>
          {sortedVerses.map((verseKey) => {
            const verse = quranService.getVerseByKey(verseKey);
            return (
              <div key={verseKey} className="tags-display-chapter-verses-item">
                <VerseTags tags={tags} versesTags={versesTags[verse.key]} />
                <SelectedVerseComponent
                  verse={verse}
                  handleClickVerse={handleClickVerse}
                />
                <NoteText verseKey={verse.key} />
              </div>
            );
          })}
        </>
      ) : (
        <p className="text-center" dir="ltr">
          There are no verses matching the selected tags.
        </p>
      )}
    </div>
  );
}

interface SelectedVerseComponentProps {
  verse: verseProps;
  handleClickVerse: (verse: verseProps) => void;
}

const SelectedVerseComponent = ({
  verse,
  handleClickVerse,
}: SelectedVerseComponentProps) => {
  const quranService = useQuran();

  function onClickVerse(verse: verseProps) {
    handleClickVerse(verse);
  }

  return (
    <span className="fs-3">
      {verse.versetext}{" "}
      <span
        onClick={() => onClickVerse(verse)}
        className="tags-display-chapter-verses-item-verse"
      >
        ({quranService.getChapterName(verse.suraid) + ":" + verse.verseid})
      </span>
      <ExpandButton identifier={verse.key} />
    </span>
  );
};

interface ListVersesProps {
  currentChapter: number;
  versesTags: versesTagsProps;
  tags: tagsProps;
  scrollKey: string;
  dispatchTagsAction: Dispatch<tagsActionsProps>;
}

const ListVerses = memo(
  ({
    currentChapter,
    versesTags,
    tags,
    scrollKey,
    dispatchTagsAction,
  }: ListVersesProps) => {
    const quranService = useQuran();

    const [stateVerses, setStateVerses] = useState<verseProps[]>([]);

    const [isPending, startTransition] = useTransition();

    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const verseToHighlight = scrollKey
        ? listRef.current?.querySelector(`[data-id="${scrollKey}"]`)
        : "";

      if (verseToHighlight) {
        verseToHighlight.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, [scrollKey, isPending]);

    useEffect(() => {
      //
      startTransition(() => {
        setStateVerses(quranService.getVerses(currentChapter));
      });
    }, [currentChapter]);

    return (
      <>
        <div className="card-header text-center fs-3 tags-display-chapter-title">
          سورة {quranService.getChapterName(currentChapter)}
        </div>
        <div className="card-body tags-display-chapter-verses" ref={listRef}>
          {isPending ? (
            <LoadingSpinner />
          ) : (
            stateVerses.map((verse) => (
              <div
                key={verse.key}
                data-id={verse.key}
                className={`tags-display-chapter-verses-item ${
                  scrollKey === verse.key
                    ? "tags-display-chapter-verses-item-highlighted"
                    : ""
                }`}
              >
                {versesTags[verse.key] !== undefined && (
                  <VerseTags versesTags={versesTags[verse.key]} tags={tags} />
                )}
                <ListVerseComponent
                  verse={verse}
                  dispatchTagsAction={dispatchTagsAction}
                />
                <NoteText verseKey={verse.key} />
              </div>
            ))
          )}
        </div>
      </>
    );
  }
);

interface ListVerseComponentProps {
  verse: verseProps;
  dispatchTagsAction: Dispatch<tagsActionsProps>;
}

const ListVerseComponent = memo(
  ({ verse, dispatchTagsAction }: ListVerseComponentProps) => {
    function onClickTagVerse(verse: verseProps) {
      dispatchTagsAction(tagsActions.setCurrentVerse(verse));
    }

    function onClickVerse() {
      dispatchTagsAction(tagsActions.setScrollKey(verse.key));
    }

    return (
      <>
        <span className={`tags-display-chapter-verses-item-text fs-3`}>
          {verse.versetext}{" "}
          <span
            className="tags-display-chapter-verses-item-text-btn"
            onClick={onClickVerse}
          >
            ({verse.verseid})
          </span>{" "}
        </span>
        <ExpandButton identifier={verse.key} />
        <button
          className="btn"
          data-bs-toggle="modal"
          data-bs-target="#verseTagsModal"
          onClick={() => onClickTagVerse(verse)}
        >
          🏷️
        </button>
      </>
    );
  }
);

ListVerseComponent.displayName = "ListVerseComponent";

interface VerseTagsProps {
  versesTags: string[];
  tags: tagsProps;
}

function VerseTags({ versesTags, tags }: VerseTagsProps) {
  return (
    <div className="fs-5 tags-display-chapter-verses-item-tags">
      {versesTags.map((tagID) => (
        <span
          className="tags-display-chapter-verses-item-tags-item"
          key={tagID}
        >
          {tags[tagID].tagDisplay}
        </span>
      ))}
    </div>
  );
}

export default TagsDisplay;
