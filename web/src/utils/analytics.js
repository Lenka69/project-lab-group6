import LogRocket from "logrocket";

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const LOGROCKET_APP_ID = import.meta.env.VITE_LOGROCKET_APP_ID;

const isProduction = import.meta.env.PROD;
const isBrowser = typeof window !== "undefined";

let analyticsInitialized = false;

const loadGoogleAnalyticsScript = (measurementId) => {
  if (!isBrowser || document.getElementById("google-analytics-script")) {
    return;
  }

  const script = document.createElement("script");
  script.id = "google-analytics-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;

  document.head.appendChild(script);
};

export const initAnalytics = () => {
  if (!isBrowser || analyticsInitialized || !isProduction) {
    return;
  }

  if (GA_MEASUREMENT_ID) {
    loadGoogleAnalyticsScript(GA_MEASUREMENT_ID);

    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gtag() {
        window.dataLayer.push(arguments);
      };

    window.gtag("js", new Date());

    window.gtag("config", GA_MEASUREMENT_ID, {
      send_page_view: false,
    });
  }

  if (LOGROCKET_APP_ID) {
    LogRocket.init(LOGROCKET_APP_ID);
  }

  analyticsInitialized = true;
};

export const trackPageView = (path) => {
  if (!isBrowser || !isProduction) {
    return;
  }

  initAnalytics();

  if (!GA_MEASUREMENT_ID || !window.gtag) {
    return;
  }

  window.gtag("event", "page_view", {
    page_title: document.title,
    page_location: `${window.location.origin}${path}`,
    page_path: path,
  });
};

const removeSensitiveParams = (params = {}) => {
  const blockedKeys = ["email", "name", "password", "token", "accessToken"];

  return Object.fromEntries(
    Object.entries(params).filter(
      ([key]) => !blockedKeys.includes(key.toLowerCase())
    )
  );
};

export const trackEvent = (eventName, params = {}) => {
  if (!isBrowser || !isProduction || !eventName) {
    return;
  }

  initAnalytics();

  const safeParams = removeSensitiveParams(params);

  if (GA_MEASUREMENT_ID && window.gtag) {
    window.gtag("event", eventName, safeParams);
  }

  if (LOGROCKET_APP_ID && LogRocket.track) {
    LogRocket.track(eventName, safeParams);
  }
};

export const identifyUser = (user) => {
  if (!isBrowser || !isProduction || !LOGROCKET_APP_ID || !user) {
    return;
  }

  initAnalytics();

  const userId = user.id || user._id || user.email;

  if (!userId) {
    return;
  }

  LogRocket.identify(String(userId), {
    name: user.name || "",
    email: user.email || "",
  });
};