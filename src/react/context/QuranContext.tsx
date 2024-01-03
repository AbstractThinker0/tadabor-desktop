import { createContext, useContext, PropsWithChildren, useRef } from "react";

import chapterNames from "../../data/chapters.json";
import allQuranText from "../../data/quran_v2.json";
import quranRoots from "../../data/quranRoots.json";

import quranClass from "@/util/quranService";

const QuranContext = createContext<quranClass | null>(null);

export const QuranProvider = ({ children }: PropsWithChildren) => {
  const quranInstance = useRef(new quranClass());

  quranInstance.current.setChapters(chapterNames);
  quranInstance.current.setQuran(allQuranText);
  quranInstance.current.setRoots(quranRoots);

  return (
    <QuranContext.Provider value={quranInstance.current}>
      {children}
    </QuranContext.Provider>
  );
};

const useQuran = () => {
  const quranInstance = useContext(QuranContext);

  if (!quranInstance) {
    throw new Error("useQuran must be used within a QuranProvider");
  }

  return quranInstance;
};

export default useQuran;
