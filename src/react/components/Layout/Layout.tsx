import { PropsWithChildren, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import Navbar from "./Navbar";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { QuranProvider } from "../../context/QuranContext";

function Layout({ children }: PropsWithChildren) {
  const mainRef = useRef<HTMLElement>(null);
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.dir = i18n.dir();
    }
  }, [i18n.resolvedLanguage, i18n]);

  return (
    <main ref={mainRef}>
      <Navbar />
      <AlertMessage />
      <QuranProvider>{children}</QuranProvider>
      <ToastContainer
        position={`${isRtl ? "top-left" : "top-right"}`}
        rtl={isRtl}
      />
    </main>
  );
}

const AlertMessage = () => {
  const { t } = useTranslation();

  return (
    <div
      className="alert alert-warning alert-dismissible fade show d-flex justify-content-center m-0"
      role="alert"
    >
      {t("alert_message")}
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
      ></button>
    </div>
  );
};

export default Layout;
