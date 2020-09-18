import {useDispatch} from "react-redux";
import rootReducer from "@store/rootReducer";
import {getFirestore} from "redux-firestore";
import {getFirebase} from "react-redux-firebase";
import {configureStore, ThunkAction, Action} from "@reduxjs/toolkit";


import {MakeStore, createWrapper, Context, HYDRATE} from 'next-redux-wrapper';

const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false,
        thunk: {
            extraArgument: {getFirestore, getFirebase}
        }
    })
})


const makeStore: MakeStore = (context: Context) => {
    return store;
}

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export const useAppDispatch = () => useDispatch<AppDispatch>()
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>

export const wrapper = createWrapper<RootState>(makeStore, {debug: true});

