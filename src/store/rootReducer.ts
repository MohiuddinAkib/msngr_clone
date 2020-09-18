import {combineReducers} from "@reduxjs/toolkit"
import {firestoreReducer} from "redux-firestore";
import {FirebaseReducer, firebaseReducer, FirestoreReducer} from "react-redux-firebase";

export interface Profile {
    first_name: string;
    last_name: string;
}

export interface Participant {
    conversation_id: string;
    users_id: string;
    type: string;
    created_at: string;
    updated_at: string;
}

interface Conversation {
    id: string;
    title: string;
    creator_id: string;
    channel_id: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}

interface Schema {
    converstaions: Conversation;
    participants: Participant;
}

export default combineReducers<{
    firebase: FirebaseReducer.Reducer<Profile, Schema>,
    firestore: FirestoreReducer.Reducer
}>({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
})