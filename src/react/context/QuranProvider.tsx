import {
  createContext,
  PropsWithChildren,
  useRef,
  useState,
  useEffect,
} from "react";

import quranClass from "@/util/quranService";
import LoadingSpinner from "@/components/LoadingSpinner";

export const QuranContext = createContext<quranClass | null>(null);

export const QuranProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true);
  const quranInstance = useRef(new quranClass());

  useEffect(() => {
    let clientLeft = false;

    async function fetchData() {
      try {
        const chaptersData = await import("../../data/chapters.json");

        if (clientLeft) return;

        quranInstance.current.setChapters(chaptersData.default);

        const qurandata = await import("../../data/quran_v2.json");

        if (clientLeft) return;

        quranInstance.current.setQuran(qurandata.default);

        const rootsData = await import("../../data/quranRoots.json");

        if (clientLeft) return;

        quranInstance.current.setRoots(rootsData.default);
      } catch (error) {
        fetchData();
        return;
      }

      setIsLoading(false);
    }

    fetchData();

    return () => {
      clientLeft = true;
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <QuranContext.Provider value={quranInstance.current}>
      {children}
    </QuranContext.Provider>
  );
};
