import { IThunkApi } from "@src/types/IThunkApi";
import { RootState } from "@store/configureStore";
import { IUserMessage } from "@src/models/IUserMessage";
import { IParticipant } from "@src/models/IParticipant";
import { COLLECTIONS } from "@src/api/firebaseClientApi";
import { ConversationState } from "./ConversationState";
import { IConversation } from "@src/models/IConversation";
import { Participant } from "@src/data/domain/Participant";
import { Conversation } from "@src/data/domain/Conversation";
import { Message, MessageBlock } from "@src/data/domain/Message";
import { authStateSelector } from "@store/selectors/authSelector";
import { formatMessageWithoutConverter } from "@src/api/conversationApi";
import { IStoreUserConversation } from "@src/types/IStoreUserConversation";
import {createAsyncThunk, createSlice, createSelector} from "@reduxjs/toolkit";

const initialState: ConversationState = {
    loading: false,
    selectedConvId: "",
    user_conversations: {},
}

export const loadAuthConversationData = createAsyncThunk<any, void, IThunkApi>("conversations/loadConversationData", async (data: void, thunkApi) => {
    try {
        const firestore = thunkApi.extra.getFirestore();
        const state = thunkApi.getState()
        const auth = state.firebase.auth

        const conversations: Record<string, IStoreUserConversation> = {};

        if(!auth) {
            return conversations;
        }

        const conversationsQuerySnapshot = await firestore
        .collection(COLLECTIONS.conversations)
        .where(COLLECTIONS.participants, "array-contains", auth.uid)
        .where("deleted_at", "==", null)
        .orderBy("last_activity", "desc")
        .get();


        const messagesQuerySnapshotsPromise = conversationsQuerySnapshot.docs.map(
        (conversationDoc) =>
            conversationDoc.ref
            .collection(COLLECTIONS.messages)
            .where("deleted_at", "==", null)
            
            .orderBy("created_at", "asc")
            .get()
        );

        const participantsQuerySnapshotsPromise = conversationsQuerySnapshot.docs.map(
        (conversationDoc) =>
            conversationDoc.ref
            .collection(COLLECTIONS.participants)
            .get()
        );

        const messagesQuerySnapshots = await Promise.all(
        messagesQuerySnapshotsPromise
        );

        const participantsQuerySnapshots = await Promise.all(
        participantsQuerySnapshotsPromise
        );

        let index = 0;
        conversationsQuerySnapshot.forEach((conversationDoc) => {
        const conversation = conversationDoc.data() as IConversation;

        conversations[conversationDoc.id] = {
            messages: {},
            participants: {},
            data: conversation,
            formatted_messages: []
        };

        const messagesQuerySnapshot = messagesQuerySnapshots[index];
        const messageIds = [];
        const messages: IUserMessage[] = [];

        messagesQuerySnapshot.forEach((messageDoc) => {
            const message = messageDoc.data() as IUserMessage;
            messages.push(message)
            messageIds.push(messageDoc.id)
            conversations[conversationDoc.id].messages[messageDoc.id] = message;
        });

        const formattedMessages = formatMessageWithoutConverter(messageIds, messages)
        conversations[conversationDoc.id].formatted_messages = formattedMessages

        const participantsQuerySnapshot = participantsQuerySnapshots[index];
        participantsQuerySnapshot.forEach((participantDoc) => {
            const participant = participantDoc.data() as IParticipant;

            conversations[conversationDoc.id].participants[
                participantDoc.id
            ] = participant;
        });

        index++;
        });

        return conversations as Record<string, {
            data: IConversation;
            messages: Record<string, IUserMessage>;
            participants: Record<string, IParticipant>;
        }>;
    } catch (error) {
      return thunkApi.rejectWithValue(error)
    }
})

export const conversationSlice = createSlice({
    name: "conversations",
    initialState,
    reducers: {
        selectConversation: (state, action) => {
            state.selectedConvId = action.payload
        }
    },
    extraReducers: builder => {
        builder.addCase(loadAuthConversationData.pending, (state) => {
            state.loading = true
        })
        builder.addCase(loadAuthConversationData.rejected, (state) => {
            state.loading = false
        })
        .addCase(loadAuthConversationData.fulfilled, (state, action) => {
            state.user_conversations = action.payload
            state.loading = false
        })
    }
})

export const conversationStateSelector = (state: RootState) => state.conversation

export const conversationsLoadingSelector = createSelector(conversationStateSelector, state => state.loading)

export const selectedConversationIdSelector = createSelector(conversationStateSelector, (state) => state.selectedConvId)

export const userConversationsSelector = createSelector(conversationStateSelector, (converationState) => converationState.user_conversations)

export const userConversationsMapConvertedSelector = createSelector(authStateSelector, userConversationsSelector, (auth, userConversations) => Object.entries(userConversations).map(([id, conversation]) => {
    const obj =  new Conversation(auth.uid, id, conversation.data)
    obj.setMessages(conversation.messages)
    obj.setParticipants(conversation.participants)
    obj.setFormattedMessages(conversation.formatted_messages)
    return obj
}).reduce((acc, curr) => {
    acc[curr.id] = curr
    return acc
}, {} as Record<string, Conversation>))

export const userConversationsArrayConvertedSelector = createSelector(userConversationsMapConvertedSelector, (userConversations) => {
    return Object.values(userConversations)
})

export const selectedConversationSelector = createSelector(userConversationsMapConvertedSelector,selectedConversationIdSelector, (user_conversations, selectedConversationId) => user_conversations[selectedConversationId])