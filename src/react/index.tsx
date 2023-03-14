import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./styles/main.scss";

// Import all of Bootstrap's JS
import "bootstrap";

import "./i18n";
import Layout from "./components/Layout/Layout";

import { HashRouter } from "react-router-dom";

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
