import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import LogRocket from "logrocket";
import App from "./App.jsx";
import ResetScroll from "./components/ResetScroll.jsx";

const logRocketAppId = import.meta.env.VITE_LOGROCKET_APP_ID;

if (import.meta.env.PROD && logRocketAppId) {
  LogRocket.init(logRocketAppId);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ResetScroll />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);