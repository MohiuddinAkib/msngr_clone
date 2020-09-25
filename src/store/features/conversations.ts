import {RootState} from "@store/configureStore";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {ExtendedFirestoreInstance} from "react-redux-firebase";

export const fetchConversations = createAsyncThunk(
    'users/fetchByIdStatus',
    async (userId, thunkAPI) => {
        const state = thunkAPI.getState() as RootState
        const auth = state.firebase.auth
        const {getFirebase, getFirestore} = thunkAPI.extra as any
        const firebase = getFirebase()
        const firestore: ExtendedFirestoreInstance = getFirestore()

        const participantsSnapshot = await firestore
            .collection("participants")
            .where("users_id", "==", firestore.doc(`users/${auth.uid}`))
            .get()



        console.log(participantsSnapshot)
        return ["hahahah"]
    }
)

export const conversationSlice = createSlice({
    name: "conversations",
    initialState: [],
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchConversations.fulfilled, (state, action) => {
                state.push(...action.payload)
                console.log("fetchConversations fulfilled", action)
            })
            .addDefaultCase((state, action) => state)
    }
})

