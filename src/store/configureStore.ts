import {useDispatch} from "react-redux";
import rootReducer from "@store/rootReducer";
import firebase from "@src/api/firebaseClientApi"
import {constants as rfConstants} from "redux-firestore"
import {getFirestore, reduxFirestore} from "redux-firestore";
import {configureStore, ThunkAction, Action} from "@reduxjs/toolkit";
import {MakeStore, createWrapper, Context, HYDRATE} from "next-redux-wrapper";
import {getFirebase, actionTypes as rrfActionTypes} from "react-redux-firebase";

const store = configureStore({
    reducer: rootReducer,
    enhancers: defaultEnhancers => defaultEnhancers.concat(reduxFirestore(firebase as any)),
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        immutableCheck: {
            ignoredPaths: ["firebase", "firestore"],
        },
        serializableCheck: {
            ignoredActions: [
                // just ignore every redux-firebase and react-redux-firebase action type
                ...Object.keys(rfConstants.actionTypes).map(
                    type => `${rfConstants.actionsPrefix}/${type}`
                ),
                ...Object.keys(rrfActionTypes).map(
                    type => `@@reactReduxFirebase/${type}`
                )
            ],
            ignoredPaths: ["firebase", "firestore"]
        },
        thunk: {
            extraArgument: {getFirestore, getFirebase}
        },
    })
})


const makeStore: MakeStore = (context: Context) => {
    return store;
}

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export const useAppDispatch = () => useDispatch<AppDispatch>()
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>

export const wrapper = createWrapper<RootState>(makeStore, {
    debug: true,
    serializeState: state => {
        return JSON.stringify(state)
    },
    deserializeState: state => {
        return JSON.parse(state)
    }
});

