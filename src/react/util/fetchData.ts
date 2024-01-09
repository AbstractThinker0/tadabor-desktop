import { translationsProps } from "@/types";

const fetchChapters = async () => {
  return (await import("../../data/chapters.json")).default;
};

const fetchQuran = async () => {
  return (await import("../../data/quran_v2.json")).default;
};

const fetchRoots = async () => {
  return (await import("../../data/quranRoots.json")).default;
};

const fetchTranslations = async () => {
  const transData: translationsProps = {};

  transData["Muhammad Asad"] = (
    await import("../../data/trans/Muhammad Asad v3.json")
  ).default;
  transData["The Monotheist Group"] = (
    await import("../../data/trans/The Monotheist Group.json")
  ).default;

  return transData;
};

export { fetchChapters, fetchQuran, fetchRoots, fetchTranslations };
