import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { Tooltip } from "bootstrap";

import { dbFuncs } from "@/util/db";
import useQuran from "@/context/useQuran";
import { hasAllLetters, normalizeAlif, getRootMatches } from "@/util/util";
import { rootProps, verseMatchResult, searchIndexProps } from "@/types";
import { selecRootNote, useAppDispatch, useAppSelector } from "@/store";
import { rootNotesActions } from "@/store/slices/global/rootNotes";

import { ExpandButton } from "@/components/Generic/Buttons";
import { TextForm } from "@/components/Custom/TextForm";
import VerseHighlightMatches from "@/components/Generic/VerseHighlightMatches";

import NoteText from "@/components/Custom/NoteText";
import VerseContainer from "@/components/Custom/VerseContainer";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import { CollapseContent } from "@/components/Generic/Collapse";

interface RootsListProps {
  searchInclusive: boolean;
  searchString: string;
  handleVerseTab: (verseKey: string) => void;
  stateRoots: rootProps[];
  handleRoots: (roots: rootProps[]) => void;
}

const RootsList = memo(
  ({
    searchString,
    searchInclusive,
    handleVerseTab,
    stateRoots,
    handleRoots,
  }: RootsListProps) => {
    const quranService = useQuran();

    const [itemsCount, setItemsCount] = useState(80);

    const [isPending, startTransition] = useTransition();

    useEffect(() => {
      startTransition(() => {
        const normalizedToken = normalizeAlif(searchString, true);

        handleRoots(
          quranService.quranRoots.filter((root) => {
            const normalizedRoot = normalizeAlif(root.name, true);

            return (
              normalizedRoot.startsWith(normalizedToken) ||
              !searchString ||
              (searchInclusive &&
                hasAllLetters(normalizedRoot, normalizedToken))
            );
          })
        );
      });
    }, [searchString, searchInclusive]);

    const fetchMoreData = () => {
      setItemsCount((state) => state + 15);
    };

    function handleScroll(event: React.UIEvent<HTMLDivElement>) {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      // Reached the bottom, ( the +10 is needed since the scrollHeight - scrollTop doesn't seem to go to the very bottom for some reason )
      if (scrollHeight - scrollTop <= clientHeight + 10) {
        fetchMoreData();
      }
    }

    return (
      <div className="roots-panel-list" onScroll={handleScroll}>
        {isPending ? (
          <LoadingSpinner />
        ) : (
          stateRoots
            .slice(0, itemsCount)
            .map((root) => (
              <RootComponent
                key={root.id}
                root_occurences={root.occurences}
                root_name={root.name}
                root_id={root.id.toString()}
                root_count={root.count}
                handleVerseTab={handleVerseTab}
              />
            ))
        )}
      </div>
    );
  }
);

RootsList.displayName = "RootsList";

interface RootComponentProps {
  root_occurences: string[];
  root_name: string;
  root_id: string;
  root_count: string;
  handleVerseTab: (verseKey: string) => void;
}

const RootComponent = memo(
  ({
    root_occurences,
    root_name,
    root_id,
    root_count,
    handleVerseTab,
  }: RootComponentProps) => {
    const currentNote = useAppSelector(selecRootNote(root_id));
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const noteText = currentNote?.text || "";
    const inputDirection = currentNote?.dir || "";

    const [stateEditable, setStateEditable] = useState(noteText ? false : true);

    const handleNoteSubmit = useCallback(
      (key: string, value: string) => {
        dbFuncs
          .saveRootNote(key, value, inputDirection)
          .then(function () {
            toast.success(t("save_success"));
          })
          .catch(function () {
            toast.error(t("save_failed"));
          });

        setStateEditable(false);
      },
      [inputDirection]
    );

    const handleSetDirection = useCallback((root_id: string, dir: string) => {
      dispatch(
        rootNotesActions.changeRootNoteDir({
          name: root_id,
          value: dir,
        })
      );
    }, []);

    const handleNoteChange = useCallback((name: string, value: string) => {
      dispatch(rootNotesActions.changeRootNote({ name, value }));
    }, []);

    const handleEditClick = useCallback(() => {
      setStateEditable(true);
    }, []);

    return (
      <div className="roots-panel-list-item border">
        <div className="roots-panel-list-item-title fs-4">
          <div className="roots-panel-list-item-title-pc">placeholder</div>
          <div className="roots-panel-list-item-title-text">{root_name}</div>
          <div className="roots-panel-list-item-title-btns">
            <ExpandButton identifier={root_id} value={root_id} />
            <button
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#collapseOccs${root_id}`}
              aria-expanded="false"
              aria-controls={`collapseOccs${root_id}`}
              className="btn roots-panel-list-item-title-btns-derivations"
              value={root_id}
            >
              {t("derivations")} ({root_count})
            </button>
          </div>
        </div>
        <TextForm
          inputKey={root_id}
          inputValue={noteText}
          isEditable={stateEditable}
          inputDirection={inputDirection}
          handleSetDirection={handleSetDirection}
          handleInputChange={handleNoteChange}
          handleInputSubmit={handleNoteSubmit}
          handleEditClick={handleEditClick}
        />
        <RootOccurences
          root_id={root_id}
          root_occurences={root_occurences}
          handleVerseTab={handleVerseTab}
        />
      </div>
    );
  }
);

RootComponent.displayName = "RootComponent";

interface RootOccurencesProps {
  root_occurences: string[];
  root_id: string;
  handleVerseTab: (verseKey: string) => void;
}

const RootOccurences = ({
  root_occurences,
  root_id,
  handleVerseTab,
}: RootOccurencesProps) => {
  const quranService = useQuran();
  const [isShown, setIsShown] = useState(false);
  const [itemsCount, setItemsCount] = useState(20);
  const refCollapse = useRef<HTMLDivElement>(null);
  const [scrollKey, setScrollKey] = useState("");

  useEffect(() => {
    const collapseElement = refCollapse.current;
    function onShowRoots() {
      setIsShown(true);
    }

    function onHiddenRoots() {
      setIsShown(false);
    }

    if (collapseElement !== null) {
      collapseElement.addEventListener("show.bs.collapse", onShowRoots);
      collapseElement.addEventListener("hidden.bs.collapse", onHiddenRoots);
    }

    return () => {
      if (collapseElement !== null) {
        collapseElement.removeEventListener("show.bs.collapse", onShowRoots);
        collapseElement.removeEventListener(
          "hidden.bs.collapse",
          onHiddenRoots
        );
      }
    };
  }, []);

  function onScrollOccs(event: React.UIEvent<HTMLDivElement>) {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    // Reached the bottom, ( the +10 is needed since the scrollHeight - scrollTop doesn't seem to go to the very bottom for some reason )
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      setItemsCount((state) => state + 10);
    }
  }

  const derivations: searchIndexProps[] = [];

  const rootVerses: verseMatchResult[] = [];

  root_occurences.forEach((occ) => {
    const occData = occ.split(":");
    const verse = quranService.getVerseByRank(occData[0]);
    const wordIndexes = occData[1].split(",");
    const verseWords = verse.versetext.split(" ");

    const chapterName = quranService.getChapterName(verse.suraid);
    const verseDerivations = wordIndexes.map((wordIndex) => ({
      name: verseWords[Number(wordIndex) - 1],
      key: verse.key,
      text: `${chapterName}:${verse.verseid}`,
      wordIndex,
    }));

    derivations.push(...verseDerivations);

    const verseParts = getRootMatches(verseWords, wordIndexes);

    rootVerses.push({
      verseParts,
      key: verse.key,
      suraid: verse.suraid,
      verseid: verse.verseid,
    });
  });

  const slicedItems = rootVerses.slice(0, itemsCount);

  function handleDerivationClick(verseKey: string, verseIndex: number) {
    if (itemsCount < verseIndex + 20) {
      setItemsCount(verseIndex + 20);
    }
    setScrollKey(verseKey);
  }

  useEffect(() => {
    if (!scrollKey) return;

    if (!refCollapse.current) return;

    const verseToHighlight = refCollapse.current.querySelector(
      `[data-child-id="${scrollKey}"]`
    );

    if (!verseToHighlight) return;

    verseToHighlight.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [scrollKey]);

  return (
    <CollapseContent
      refCollapse={refCollapse}
      identifier={`collapseOccs${root_id}`}
    >
      {isShown && (
        <div
          className="roots-panel-list-item-verses p-3"
          onScroll={onScrollOccs}
          dir="rtl"
        >
          <DerivationsComponent
            searchIndexes={derivations}
            handleDerivationClick={handleDerivationClick}
          />
          {slicedItems.map((verse) => (
            <div
              key={verse.key}
              className={`roots-panel-list-item-verses-item ${
                scrollKey === verse.key
                  ? "roots-panel-list-item-verses-item-selected"
                  : ""
              }`}
              data-child-id={verse.key}
            >
              <RootVerse rootVerse={verse} handleVerseTab={handleVerseTab} />
            </div>
          ))}
        </div>
      )}
    </CollapseContent>
  );
};

interface DerivationsComponentProps {
  handleDerivationClick: (verseKey: string, verseIndex: number) => void;
  searchIndexes: searchIndexProps[];
}

const DerivationsComponent = memo(
  ({ searchIndexes, handleDerivationClick }: DerivationsComponentProps) => {
    const refListRoots = useRef<HTMLSpanElement>(null);
    useEffect(() => {
      if (!refListRoots.current) return;

      //init tooltip
      const tooltipArray = Array.from(
        refListRoots.current.querySelectorAll('[data-bs-toggle="tooltip"]')
      ).map((tooltipNode) => new Tooltip(tooltipNode));

      return () => {
        tooltipArray.forEach((tooltip) => tooltip.dispose());
      };
    }, [searchIndexes]);

    return (
      <div className="p-2">
        <span ref={refListRoots} className="">
          {searchIndexes.map((root: searchIndexProps, index: number) => (
            <span
              role="button"
              key={index}
              onClick={() => handleDerivationClick(root.key, index)}
              data-bs-toggle="tooltip"
              data-bs-title={root.text}
            >
              {`${index ? " -" : " "} ${root.name}`}
            </span>
          ))}
        </span>
        <hr />
      </div>
    );
  }
);

DerivationsComponent.displayName = "DerivationsComponent";

interface RootVerseProps {
  rootVerse: verseMatchResult;
  handleVerseTab: (verseKey: string) => void;
}

const RootVerse = ({ rootVerse, handleVerseTab }: RootVerseProps) => {
  const quranService = useQuran();

  const verseChapter = quranService.getChapterName(rootVerse.suraid);

  const onClickChapter = () => {
    handleVerseTab(rootVerse.key);
  };

  return (
    <>
      <VerseContainer>
        <VerseHighlightMatches verse={rootVerse} />{" "}
        <span
          onClick={onClickChapter}
          className="roots-panel-list-item-verses-item-text-chapter"
        >{`(${verseChapter}:${rootVerse.verseid})`}</span>
        <ExpandButton identifier={`${rootVerse.key}child`} />
      </VerseContainer>
      <NoteText verseKey={rootVerse.key} targetID={`${rootVerse.key}child`} />
    </>
  );
};

export default RootsList;
