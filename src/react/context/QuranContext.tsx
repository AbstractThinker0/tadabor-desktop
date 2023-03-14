import {
  createContext,
  useState,
  useEffect,
  useContext,
  PropsWithChildren,
} from "react";

import LoadingSpinner from "../components/LoadingSpinner";

import chapterNames from "../../data/chapters.json";
import allQuranText from "../../data/quran_v2.json";
import quranRoots from "../../data/quranRoots.json";
import absoluteQuran from "../../data/absoluteQuran.json";

import { chapterProps, quranProps, rootProps, verseProps } from "../types";

type QuranContent = {
  chapterNames: chapterProps[];
  allQuranText: quranProps[];
  quranRoots: rootProps[];
  absoluteQuran: verseProps[];
};

const QuranContext = createContext<QuranContent>({
  chapterNames: [],
  allQuranText: [],
  quranRoots: [],
  absoluteQuran: [],
});

export const QuranProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let clientLeft = false;

    setIsLoading(false);

    return () => {
      clientLeft = true;
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <QuranContext.Provider
      value={{
        allQuranText: allQuranText,
        chapterNames: chapterNames,
        quranRoots: quranRoots,
        absoluteQuran: absoluteQuran,
      }}
    >
      {children}
    </QuranContext.Provider>
  );
};

const useQuran = () => useContext(QuranContext);

export default useQuran;
