import { IProfile } from "@src/models/IProfile";
import { combineReducers } from "@reduxjs/toolkit";
import { firestoreReducer } from "redux-firestore";
import { IParticipant } from "@src/models/IParticipant";
import { IConversation } from "@src/models/IConversation";
import { IUserPresence } from "@src/models/IUserPresence";
import { authSlice } from "@store/features/auth/authSlice";
import { conversationSlice } from "@store/features/conversation/conversationSlice";
import {
  FirebaseReducer,
  firebaseReducer,
  FirestoreReducer,
} from "react-redux-firebase";

interface Schema {
  converstaions: IConversation;
  participants: IParticipant;
  presence: IUserPresence;
}

export default combineReducers<{
  firestore: FirestoreReducer.Reducer;
  auth: ReturnType<typeof authSlice.reducer>;
  firebase: FirebaseReducer.Reducer<IProfile, Schema>;
  conversation: ReturnType<typeof conversationSlice.reducer>;
}>({
  auth: authSlice.reducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  conversation: conversationSlice.reducer,
});
