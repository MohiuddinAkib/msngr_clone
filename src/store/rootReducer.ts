import {combineReducers} from "@reduxjs/toolkit"
import {firestoreReducer} from "redux-firestore";
import {firebaseReducer} from "react-redux-firebase";

export default combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
})