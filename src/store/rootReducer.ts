import {firestore} from "firebase";
import IGif from "@giphy/js-types/dist/gif";
import {combineReducers} from "@reduxjs/toolkit"
import {firestoreReducer} from "redux-firestore";
import {conversationSlice} from "@store/features/conversations";
import {FirebaseReducer, firebaseReducer, FirestoreReducer} from "react-redux-firebase";

export interface Profile {
    first_name: string;
    last_name: string;
}

export interface Participant {
    conversation_id: firestore.DocumentReference;
    users_id: firestore.DocumentReference;
    type: string;
    created_at: string;
    updated_at: string;
}

export interface Conversation {
    title: string;
    creator_id: string;
    channel_id: string;
    participants: string[];
    type: "private" | "group";
    created_at: firestore.Timestamp;
    updated_at: firestore.Timestamp;
    deleted_at: firestore.Timestamp | null;
}

export interface UserMessage {
    type: "text" | "gif" | "file";
    message: string | IGif;
    sender_id: string;
    created_at: string;
    name?: string;
    size?: number;
    fullPath?: string;
    downloadURL?: string;
    contentType?: "image/jpeg" | "video/webm;codecs=vp8";
    customMetadata?: Object;
    deleted_at: string | null;
    updated_at?: string
}

interface Schema {
    converstaions: Conversation;
    participants: Participant;
}

export default combineReducers<{
    firebase: FirebaseReducer.Reducer<Profile, Schema>,
    firestore: FirestoreReducer.Reducer,
    conversation: ReturnType<typeof conversationSlice.reducer>
}>({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    conversation: conversationSlice.reducer
})