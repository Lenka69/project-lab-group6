import App from "./App";
import ResetScroll from "./components/ResetScroll";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";

const appId = import.meta.env.VITE_LOGROCKET_APP_ID;

if (appId && import.meta.env.PROD) {
  LogRocket.init(appId);
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    <ResetScroll />
    <App />
  </BrowserRouter>
);