import React from "react";
import { Action, Store } from "redux";
import AuthProvider from "./AuthProvider";
import { ReactReduxContext } from "react-redux";
import firebase from "@src/api/firebaseClientApi";
import { Theme } from "@material-ui/core/styles";
import { RootState } from "@store/configureStore";
import MessengerProvider from "./MessengerProvider";
import { createFirestoreInstance } from "redux-firestore";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { makeApplicationTheme } from "@src/theme/makeApplicationTheme";

export const AppContext = React.createContext<{
  theme: Theme;
  resetErrorBoundary: Function;
  toggleDarkMode: () => void;
  darkMode: boolean;
}>({
  theme: null,
  darkMode: false,
  toggleDarkMode: null,
  resetErrorBoundary: null,
});

const ErrorFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};

const AppProvider: React.FC = (props) => {
  const [darkMode, setDarkMode] = React.useState(false);

  const appTheme = React.useMemo(() => makeApplicationTheme(darkMode), [
    darkMode,
  ]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const resetErrorBoundary = () => {};

  return (
    <AppContext.Provider
      value={{ resetErrorBoundary, theme: appTheme, toggleDarkMode, darkMode }}
    >
      <ReactReduxContext.Consumer>
        {({ store }: { store: Store<RootState, Action<string>> }) => (
          <ReactReduxFirebaseProvider
            config={{
              userProfile: "users",
              presence: "presence",
              sessions: "sessions",
              useFirestoreForProfile: true,
              useFirestoreForStorageMeta: true,
            }}
            initializeAuth
            firebase={firebase}
            dispatch={store.dispatch}
            createFirestoreInstance={createFirestoreInstance}
          >
            <ErrorBoundary
              onReset={resetErrorBoundary}
              FallbackComponent={ErrorFallback}
            >
              <AuthProvider>
                <MessengerProvider>{props.children}</MessengerProvider>
              </AuthProvider>
            </ErrorBoundary>
          </ReactReduxFirebaseProvider>
        )}
      </ReactReduxContext.Consumer>
    </AppContext.Provider>
  );
};

export default AppProvider;
