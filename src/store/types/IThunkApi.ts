import { Container } from "inversify";
import { AppDispatch, RootState } from "@store/configureStore";
import {
  ExtendedFirebaseInstance,
  ExtendedFirestoreInstance,
} from "react-redux-firebase";

export type IThunkApi = {
  dispatch: AppDispatch;
  state: RootState;
  extra: {
    getContainer: () => Container;
    getFirestore: () => ExtendedFirestoreInstance;
    getFirebase: () => ExtendedFirebaseInstance;
  };
};
