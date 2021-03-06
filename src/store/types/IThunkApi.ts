import {AppDispatch, RootState} from "@store/configureStore";
import {ExtendedFirebaseInstance, ExtendedFirestoreInstance} from "react-redux-firebase";


export type IThunkApi = {
    dispatch: AppDispatch
    state: RootState
    extra: {
        getFirestore: () => ExtendedFirestoreInstance;
        getFirebase: () => ExtendedFirebaseInstance
    }
  }