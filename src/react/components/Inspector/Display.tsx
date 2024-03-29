import { Dispatch, useEffect, useRef } from "react";

import useQuran from "@/context/useQuran";

import { clActionsProps } from "./consts";
import ListVerses from "./ListVerses";

interface DisplayProps {
  currentChapter: number;
  scrollKey: string;
  dispatchIsAction: Dispatch<clActionsProps>;
}

const Display = ({
  currentChapter,
  scrollKey,
  dispatchIsAction,
}: DisplayProps) => {
  const quranService = useQuran();
  const refDisplay = useRef<HTMLDivElement>(null);

  // Reset scroll whenever we switch from one chapter to another
  useEffect(() => {
    if (!refDisplay.current) return;

    refDisplay.current.scrollTop = 0;
  }, [currentChapter]);

  return (
    <div className="p-2 display" ref={refDisplay}>
      <div className="card display-verses">
        <div className="card-header text-primary text-center fs-3">
          سورة {quranService.getChapterName(currentChapter)}
        </div>
        <ListVerses
          currentChapter={currentChapter}
          scrollKey={scrollKey}
          dispatchIsAction={dispatchIsAction}
        />
      </div>
    </div>
  );
};

export default Display;
