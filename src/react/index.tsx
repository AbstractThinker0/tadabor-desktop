import React from "react";
import ReactDOM from "react-dom/client";

import { HashRouter } from "react-router-dom";

import store from "./store";
import { Provider } from "react-redux";

import Layout from "./components/Layout/Layout";
import App from "./App";

import "./i18n";
import DataLoader from "./components/DataLoader";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        <Layout>
          <DataLoader>
            <App />
          </DataLoader>
        </Layout>
      </HashRouter>
    </Provider>
  </React.StrictMode>
);
