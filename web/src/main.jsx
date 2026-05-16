import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import ResetScroll from "./components/ResetScroll.jsx";
import AnalyticsTracker from "./components/AnalyticsTracker.jsx";
import { initAnalytics } from "./utils/analytics.js";

initAnalytics();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AnalyticsTracker />
      <ResetScroll />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);