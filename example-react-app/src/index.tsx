import React from "react";
import ReactDOM from "react-dom";
import App from "./app/App";
import { ComponentPreviews } from "./dev/previews";
import { useDevLogin } from "./dev/hooks";
import { DevSupport } from "@haulmont/react-ide-toolbox";
// import registerServiceWorker from './registerServiceWorker';
import {
  JmixAppProvider,
  initializeApolloClient,
  Screens,
  ScreensContext
} from "@haulmont/jmix-react-core";
import { I18nProvider, Modals } from "@haulmont/jmix-react-antd";
import { initializeApp } from "@haulmont/jmix-rest";
import {
  JMIX_REST_URL,
  REST_CLIENT_ID,
  REST_CLIENT_SECRET,
  GRAPHQL_URI
} from "./config";
import metadata from "./jmix/metadata.json";
import "antd/dist/antd.min.css";
import "./index.css";
import { antdLocaleMapping, messagesMapping } from "./i18n/i18nMappings";
import "dayjs/locale/ru";
import { ApolloProvider } from "@apollo/client";

// Define types of plugins used by dayjs
import "dayjs/plugin/customParseFormat";
import "dayjs/plugin/advancedFormat";
import "dayjs/plugin/weekday";
import "dayjs/plugin/localeData";
import "dayjs/plugin/weekOfYear";
import "dayjs/plugin/weekYear";

export const jmixREST = initializeApp({
  name: "scr-jmix",
  apiUrl: JMIX_REST_URL,
  restClientId: REST_CLIENT_ID,
  restClientSecret: REST_CLIENT_SECRET,
  storage: window.localStorage,
  defaultLocale: "en"
});

const client = initializeApolloClient({
  graphqlEndpoint: GRAPHQL_URI,
  tokenStorageKey: "scr-jmix_jmixRestAccessToken",
  localeStorageKey: "scr-jmix_jmixLocale"
});

const devScreens = new Screens();

ReactDOM.render(
  <JmixAppProvider
    apolloClient={client}
    jmixREST={jmixREST}
    config={{
      appName: "scr-jmix",
      clientId: REST_CLIENT_ID, // TODO Rename once we remove REST
      secret: REST_CLIENT_SECRET,
      locale: "en"
    }}
    metadata={metadata}
    Modals={Modals}
  >
    <ApolloProvider client={client}>
      <I18nProvider
        messagesMapping={messagesMapping}
        antdLocaleMapping={antdLocaleMapping}
      >
        <DevSupport
          ComponentPreviews={
            <ScreensContext.Provider value={devScreens}>
              <ComponentPreviews />
            </ScreensContext.Provider>
          }
          useInitialHook={useDevLogin}
        >
          <App />
        </DevSupport>
      </I18nProvider>
    </ApolloProvider>
  </JmixAppProvider>,
  document.getElementById("root") as HTMLElement
);
// registerServiceWorker();
