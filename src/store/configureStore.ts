import { original } from "immer";
import { useDispatch } from "react-redux";
import rootReducer from "@store/rootReducer";
import container from "@src/inversify.config";
import firebase from "@src/api/firebaseClientApi";
import { constants as rfConstants } from "redux-firestore";
import { getFirestore, reduxFirestore } from "redux-firestore";
import { MakeStore, createWrapper, Context } from "next-redux-wrapper";
import {
  configureStore,
  ThunkAction,
  Action,
  createNextState,
} from "@reduxjs/toolkit";
import {
  getFirebase,
  actionTypes as rrfActionTypes,
} from "react-redux-firebase";

const store = configureStore({
  reducer: rootReducer,
  enhancers: (defaultEnhancers) =>
    defaultEnhancers.concat(reduxFirestore(firebase as any)),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: {
        ignoredPaths: ["firebase", "firestore"],
      },
      serializableCheck: {
        ignoredActions: [
          // just ignore every redux-firebase and react-redux-firebase action type
          ...Object.keys(rfConstants.actionTypes).map(
            (type) => `${rfConstants.actionsPrefix}/${type}`
          ),
          ...Object.keys(rrfActionTypes).map(
            (type) => `@@reactReduxFirebase/${type}`
          ),
        ],
        ignoredPaths: ["firebase", "firestore"],
      },
      thunk: {
        extraArgument: {
          getFirestore,
          getFirebase,
          // getContainer: () => container,
        },
      },
    }),
});

const makeStore: MakeStore = (context: Context) => {
  return store;
};

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export const wrapper = createWrapper<RootState>(makeStore, {
  debug: true,
  serializeState: (state) => {
    return createNextState((state, draft) => draft);
  },
  deserializeState: (state) => {
    return original(state);
  },
});
