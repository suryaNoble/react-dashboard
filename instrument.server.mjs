import * as Sentry from "@sentry/react-router";
// import * as Sentry from "@sentry/node";

import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://d87f353615636a1fcf0b42a61aadc8a6@o4509349172084736.ingest.de.sentry.io/4509349174116432",

  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0, // Capture 100% of the transactions
  profilesSampleRate: 1.0, // profile every transaction
});
