import {combineReducers} from "@reduxjs/toolkit"
import {firestoreReducer} from "redux-firestore";
import {FirebaseReducer, firebaseReducer, FirestoreReducer} from "react-redux-firebase";

interface Profile {

}

interface Schema {

}

export default combineReducers<{
    firebase: FirebaseReducer.Reducer<Profile, Schema>,
    firestore: FirestoreReducer.Reducer
}>({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
})