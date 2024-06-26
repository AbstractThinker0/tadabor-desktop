import {
  Fragment,
  memo,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";

import { Collapse, Tooltip } from "bootstrap";

import useQuran from "@/context/useQuran";

import { useAppDispatch, useAppSelector } from "@/store";
import { inspectorPageActions } from "@/store/slices/pages/inspector";

import { getRootMatches } from "@/util/util";
import {
  RankedVerseProps,
  rootProps,
  verseMatchResult,
  searchIndexProps,
} from "@/types";

import { ExpandButton } from "@/components/Generic/Buttons";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import VerseHighlightMatches from "@/components/Generic/VerseHighlightMatches";
import { CollapseContent } from "@/components/Generic/Collapse";

import NoteText from "@/components/Custom/NoteText";
import VerseContainer from "@/components/Custom/VerseContainer";

interface ListVersesProps {
  currentChapter: number;
}

const ListVerses = ({ currentChapter }: ListVersesProps) => {
  const quranService = useQuran();

  const [stateVerses, setStateVerses] = useState<RankedVerseProps[]>([]);

  const [isPending, startTransition] = useTransition();

  const scrollKey = useAppSelector((state) => state.inspectorPage.scrollKey);

  useEffect(() => {
    //
    const chapterVerses: RankedVerseProps[] = [];

    quranService.absoluteQuran.forEach((verse, index) => {
      if (verse.suraid !== currentChapter.toString()) return;

      chapterVerses.push({ ...verse, rank: index });
    });

    startTransition(() => {
      setStateVerses(chapterVerses);
    });
  }, [currentChapter]);

  const refList = useRef<HTMLDivElement>(null);

  // Reset scroll whenever we switch from one chapter to another
  useEffect(() => {
    if (!refList.current) return;

    if (!scrollKey) return;

    const verseToHighlight = refList.current.querySelector(
      `[data-id="${scrollKey}"]`
    );

    if (verseToHighlight) {
      setTimeout(() => {
        verseToHighlight.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    }
  }, [scrollKey, isPending]);

  return (
    <div ref={refList} className="card-body" dir="rtl">
      {isPending ? (
        <LoadingSpinner />
      ) : (
        stateVerses.map((verse) => (
          <div
            className={`display-verses-item ${
              scrollKey === verse.key ? "display-verses-item-selected" : ""
            }`}
            key={verse.key}
            data-id={verse.key}
          >
            <VerseWords
              verseRank={verse.rank}
              verseText={verse.versetext.split(" ")}
              verseID={verse.verseid}
              verseKey={verse.key}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default ListVerses;

interface VerseWordsProps {
  verseRank: number;
  verseText: string[];
  verseID: string;
  verseKey: string;
}

const VerseWords = ({
  verseText,
  verseRank,
  verseID,
  verseKey,
}: VerseWordsProps) => {
  const quranService = useQuran();
  const dispatch = useAppDispatch();

  const [currentRoots, setCurrentRoots] = useState<rootProps[]>([]);
  const [selectedWord, setSelectedWord] = useState(-1);
  const refCollapsible = useRef<HTMLDivElement>(null);
  const refCollapse = useRef<Collapse>();
  const refCurrentWord = useRef<number>();

  useEffect(() => {
    if (refCollapsible.current) {
      refCollapse.current = new Collapse(refCollapsible.current, {
        toggle: false,
      });
    }
  }, []);

  const onClickWord = (index: number) => {
    const wordRoots = quranService.quranRoots.filter((root) =>
      root.occurences.find((occ) => {
        const rootData = occ.split(":");

        if (rootData[0] !== verseRank.toString()) return false;

        const wordIndexes = rootData[1].split(",");

        return wordIndexes.includes(index.toString());
      })
    );

    setCurrentRoots(wordRoots.sort((a, b) => b.name.length - a.name.length));

    if (selectedWord === index) {
      setSelectedWord(-1);
    } else {
      setSelectedWord(index);
    }

    if (refCollapse.current) {
      if (refCurrentWord.current === index) {
        refCollapse.current.hide();
        refCurrentWord.current = -1;
      } else {
        refCollapse.current.show();
        refCurrentWord.current = index;
      }
    }
  };

  const onClickVerse = () => {
    dispatch(inspectorPageActions.setScrollKey(verseKey));
  };

  return (
    <>
      <VerseContainer extraClass="display-verses-item-text">
        {verseText.map((word, index) => (
          <Fragment key={index}>
            <span
              onClick={() => onClickWord(index + 1)}
              className={`display-verses-item-text-word ${
                selectedWord === index + 1
                  ? "display-verses-item-text-word-selected"
                  : ""
              }`}
            >
              {word}
            </span>{" "}
          </Fragment>
        ))}{" "}
        <span
          onClick={onClickVerse}
          className="display-verses-item-text-number"
        >{`(${verseID})`}</span>{" "}
        <ExpandButton identifier={verseKey} />
      </VerseContainer>
      <NoteText verseKey={verseKey} />
      <CollapseContent
        refCollapse={refCollapsible}
        identifier={`collapseExample${verseRank}`}
      >
        <div className="card card-body">
          <div
            className="accordion display-verses-item-roots"
            id="accordionPanelsStayOpenExample"
          >
            {currentRoots.map((root) => (
              <div className="accordion-item" key={root.id}>
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#panelsStayOpen-${verseRank}-${root.id}`}
                    aria-expanded="false"
                    aria-controls={`panelsStayOpen-${verseRank}-${root.id}`}
                  >
                    {root.name} ({root.count})
                  </button>
                </h2>
                <RootOccurences
                  rootID={root.id}
                  rootOccs={root.occurences}
                  verseRank={verseRank}
                />
              </div>
            ))}
          </div>
        </div>
      </CollapseContent>
    </>
  );
};

interface RootOccurencesProps {
  rootID: number;
  rootOccs: string[];
  verseRank: number;
}

const RootOccurences = ({
  rootID,
  rootOccs,
  verseRank,
}: RootOccurencesProps) => {
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

  const quranService = useQuran();

  const derivations: searchIndexProps[] = [];

  const rootVerses: verseMatchResult[] = [];

  rootOccs.forEach((occ) => {
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
      identifier={`panelsStayOpen-${verseRank}-${rootID}`}
      extraClass="accordion-collapse"
    >
      {isShown && (
        <div
          className="accordion-body p-0 display-verses-item-roots-verses"
          onScroll={onScrollOccs}
        >
          <DerivationsComponent
            searchIndexes={derivations}
            handleDerivationClick={handleDerivationClick}
          />
          <div className="p-3">
            {slicedItems.map((rootVerse) => (
              <div
                key={rootVerse.key}
                className={`display-verses-item-roots-verses-item ${
                  scrollKey === rootVerse.key
                    ? "display-verses-item-roots-verses-item-selected"
                    : ""
                }`}
              >
                <RootVerse rootVerse={rootVerse} />
              </div>
            ))}
          </div>
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
}

const RootVerse = ({ rootVerse }: RootVerseProps) => {
  const quranService = useQuran();
  const dispatch = useAppDispatch();

  const verseChapter = quranService.getChapterName(rootVerse.suraid);

  function onClickVerseChapter() {
    dispatch(inspectorPageActions.setCurrentChapter(Number(rootVerse.suraid)));
    dispatch(inspectorPageActions.setScrollKey(rootVerse.key));
  }

  return (
    <>
      <div data-child-id={rootVerse.key}>
        <VerseContainer extraClass="display-verses-item-roots-verses-item-text">
          <VerseHighlightMatches verse={rootVerse} />{" "}
          <span
            onClick={onClickVerseChapter}
            className="display-verses-item-roots-verses-item-text-chapter"
          >{`(${verseChapter}:${rootVerse.verseid})`}</span>{" "}
        </VerseContainer>
        <ExpandButton identifier={`${rootVerse.key}child`} />
      </div>
      <NoteText verseKey={rootVerse.key} targetID={`${rootVerse.key}child`} />
    </>
  );
};
