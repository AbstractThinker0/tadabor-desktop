import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";

import "@/i18n";

import store from "@/store";
import App from "@/App";

import Layout from "@/components/Layout/Layout";
import DataLoader from "@/components/Custom/DataLoader";

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
