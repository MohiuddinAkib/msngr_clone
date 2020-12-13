import {combineReducers} from "@reduxjs/toolkit"
import {firestoreReducer} from "redux-firestore";
import {conversationSlice} from "@store/features/conversation/conversationSlice";
import {FirebaseReducer, firebaseReducer, FirestoreReducer} from "react-redux-firebase";
import { IProfile } from "@src/models/IProfile";
import { IParticipant } from "@src/models/IParticipant";
import { IConversation } from "@src/models/IConversation";


interface Schema {
    converstaions: IConversation;
    participants: IParticipant;
}

export default combineReducers<{
    firebase: FirebaseReducer.Reducer<IProfile, Schema>,
    firestore: FirestoreReducer.Reducer,
    conversation: ReturnType<typeof conversationSlice.reducer>
}>({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    conversation: conversationSlice.reducer
})