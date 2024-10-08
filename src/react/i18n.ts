import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

if (localStorage.getItem("i18nextLng") === null) {
  localStorage.setItem("i18nextLng", "ar");
}

// eslint-disable-next-line import/no-named-as-default-member
i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      en: {
        translation: {
          alert_message:
            "This is a beta version of the app, please make sure to have a backup of everything you save here.",
          nav_brand: "Tadabor",
          nav_browser: "Browser",
          nav_about: "About",
          nav_roots: "Roots",
          nav_notes: "Your notes",
          nav_coloring: "Coloring",
          nav_translation: "Translation",
          nav_tags: "Tags",
          nav_inspector: "Inspector",
          nav_comparator: "Comparator",
          nav_searcher: "Searcher",
          nav_letters: "Letters",
          nav_audio: "Audio",
          search_method: "Search method: ",
          search_root: "Root",
          search_word: "Word",
          search_diacritics: "Diacritics",
          search_identical: "Identical",
          search_start: "Identical Start",
          search_all_quran: "Search in all chapters",
          search_button: "Search",
          search_count: "Verses count:",
          search_fail: "This word doesn't exist.",
          search_root_error: "This root doesn't exist or not registred.",
          search_result: "Search results for",
          search_chapters_all: "in all chapters",
          search_chapters: "in chapters:",
          text_edit: "Edit",
          text_save: "Save",
          save_success: "Successfuly saved.",
          save_failed: "Failed to save",
          no_notes: "You don't have any notes saved to be shown here.",
          word: "word",
          root: "root",
          select_all: "Select all",
          deselect_all: "Deselect all",
          all_chapters: "All chapters",
          current_chapter: "Current chapter",
          search_scope: "Search scope",
          select_notice:
            "You have to select at least one chapter to initiate a search.",
          text_form: "Enter your text",
          search_options: "Search options: ",
          derivations: "Derivations",
          search_inclusive: "Inclusive",
          notes_verses: "Verses notes",
          notes_roots: "Roots notes",
          notes_trans: "Translation",
          searcher_search: "Search",
          panel_definitions: "Definitions",
          panel_display: "Display",
          letters_preset: "Preset:",
        },
      },
      ar: {
        translation: {
          alert_message:
            "هذه نسخة تجريبيّة من التطبيق، الرجاء إبقاء نسخة إحتياط لكل ما تكتبه هنا.",
          nav_brand: "تدبر",
          nav_browser: "المتصفح",
          nav_about: "حول التطبيق",
          nav_roots: "الجذور",
          nav_notes: "كتاباتك",
          nav_coloring: "تلوين",
          nav_translation: "الترجمة",
          nav_tags: "العناوين",
          nav_inspector: "المتفحِّص",
          nav_comparator: "المقارن",
          nav_searcher: "باحث",
          nav_letters: "الحروف",
          nav_audio: "قارئ",
          search_method: "طريقة البحث: ",
          search_root: "جذر",
          search_word: "كلمة",
          search_diacritics: "بالتشكيل",
          search_identical: "مطابق",
          search_start: "مطابق للبداية",
          search_all_quran: "بحث في كل السور",
          search_button: "إبحث",
          search_count: "عدد الآيات:",
          search_fail: "لا وجود لهذه الكلمة.",
          search_root_error: "هذا الجذر غير موجود أو غير مدرج.",
          search_result: "نتائج البحث عن",
          search_chapters_all: "في كل السور",
          search_chapters: "في سور:",
          text_edit: "تعديل",
          text_save: "حفظ",
          save_success: "تم الحفظ.",
          save_failed: "فشلت عملية الحفظ.",
          no_notes: "ليس لديك أي كتابات لإظهارها هنا.",
          word: "كلمة",
          root: "جذر",
          select_all: "تحديد الكل",
          deselect_all: "إلغاء تحديد الكل",
          all_chapters: "كل السور",
          current_chapter: "السورة الحالية",
          search_scope: "نطاق البحث",
          select_notice: "يجب عليك اختيار سورة واحد على الأقل لبدء البحث.",
          text_form: "أدخل كتاباتك",
          search_options: "خيارات البحث: ",
          derivations: "الإشتقاقات",
          search_inclusive: "شامل",
          notes_verses: "آيات",
          notes_roots: "جذور",
          notes_trans: "ترجمة",
          searcher_search: "بحث",
          panel_definitions: "التعريفات",
          panel_display: "العرض",
          letters_preset: "مجموعة:",
        },
      },
    },
    //lng: "ar", // if you're using a language detector, do not define the lng option
    fallbackLng: "ar",
    supportedLngs: ["ar", "en"],

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });

export default i18n;
