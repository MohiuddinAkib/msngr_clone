import {RootState} from "@store/configureStore";
import { ConversationState } from "./ConversationState";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {ExtendedFirestoreInstance} from "react-redux-firebase";



const initialState: ConversationState = {
    selectedConvId: "",
    user_conversations: {},
}

export const conversationSlice = createSlice({
    name: "conversations",
    initialState,
    reducers: {
        selectConversation: (state, action) => {
            state.selectedConvId = action.payload
        },
        setUserConversations: (state, action) => {
            state.user_conversations = action.payload
        }
    },
    extraReducers: builder => {
        
    }
})

