import React from 'react';
import ReactDOM from 'react-dom/client';
// import * as Sentry from "@sentry/react";
import './index.css';
import App from './App';
import { ceil } from "lodash";
import axios from 'axios';

// Sentry.init({
//   dsn: "https://269a91c29da94f948f441308223e06ba@o4504978518441984.ingest.sentry.io/4504978528862208",
//   integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
//   // Performance Monitoring
//   tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
//   // Session Replay
//   replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
//   replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
// });

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<App />);

(window as any).ceil = ceil;
