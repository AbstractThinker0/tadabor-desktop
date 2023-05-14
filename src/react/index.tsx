import React from "react";
import ReactDOM from "react-dom/client";

import { HashRouter } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import App from "./App";

import "./i18n";

function render() {
  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
  );

  root.render(
    <React.StrictMode>
      <HashRouter>
        <Layout>
          <App />
        </Layout>
      </HashRouter>
    </React.StrictMode>
  );
}

render();
