import { RootState } from "@store/configureStore";
import { IThunkApi } from "@store/types/IThunkApi";
import { IUserMessage } from "@src/models/IUserMessage";
import { IParticipant } from "@src/models/IParticipant";
import { COLLECTIONS } from "@src/api/firebaseClientApi";
import { ConversationState } from "./ConversationState";
import { IConversation } from "@src/models/IConversation";
import { authStateSelector } from "@store/selectors/authSelector";
import { formatMessageWithoutConverter } from "@src/api/conversationApi";
import { IStoreUserConversation } from "@store/types/IStoreUserConversation";
import { Conversation } from "@src/data/firestoreClient/domain/Conversation";
import {createAsyncThunk, createSlice, createSelector, PayloadAction} from "@reduxjs/toolkit";

const initialState: ConversationState = {
    loading: false,
    selectedConvId: "",
    user_conversations: {},
}

export const loadNewConversationData = createAsyncThunk<{id: string; conversation: IStoreUserConversation}, string, IThunkApi>("conversations/loadNewConversationData", async (conversationId: string, thunkApi) => {
    try {
        const firestore = thunkApi.extra.getFirestore();
        const state = thunkApi.getState()
        const auth = state.firebase.auth

        const conversation:  IStoreUserConversation = {
            messages: {},
            participants: {},
            data: {},
            formatted_messages: []
        } as IStoreUserConversation;

        if(!auth) {
            return {id: "", conversation};
        }

        const conversationQuerySnapshot = await firestore
        .collection(COLLECTIONS.conversations)
        .doc(conversationId)
        .get();

        const messagesQuerySnapshot = await conversationQuerySnapshot.ref
        .collection(COLLECTIONS.messages)
        .where("deleted_at", "==", null)
        .orderBy("created_at", "asc")
        .get();

        const participantsQuerySnapshot = await conversationQuerySnapshot.ref
        .collection(COLLECTIONS.participants)
        .get();

        const messageIds = [];
        const messages: IUserMessage[] = [];

        messagesQuerySnapshot.forEach((messageDoc) => {
            const message = messageDoc.data() as IUserMessage;
            messages.push(message)
            messageIds.push(messageDoc.id)
            conversation.messages[messageDoc.id] = message;
        });

        const formattedMessages = formatMessageWithoutConverter(messageIds, messages)
        conversation.formatted_messages = formattedMessages

        participantsQuerySnapshot.forEach((participantDoc) => {
            const participant = participantDoc.data() as IParticipant;

            conversation.participants[
                participantDoc.id
            ] = participant;
        });

        return {id: conversationQuerySnapshot.id, conversation: conversation as  IStoreUserConversation}
    } catch (error) {
      return thunkApi.rejectWithValue(error)
    }
})

export const loadAuthConversationsData = createAsyncThunk<Record<string, IStoreUserConversation>, void, IThunkApi>("conversations/loadConversationData", async (data: void, thunkApi) => {
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

        return conversations as Record<string, IStoreUserConversation>;
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
        },
        storeNewMessage: (state, action: PayloadAction<{
            conversationId: string;
            messageId: string;
            message: IUserMessage}>) => {
            const {conversationId, messageId, message} = action.payload
            const conversations = state.user_conversations[conversationId]
            if(conversations) {
                conversations.messages[messageId] = message
            }
        }
    },
    extraReducers: builder => {
        builder.addCase(loadAuthConversationsData.pending, (state) => {
            state.loading = true
        })
        .addCase(loadAuthConversationsData.rejected, (state) => {
            state.loading = false
        })
        .addCase(loadAuthConversationsData.fulfilled, (state, action) => {
            state.user_conversations = action.payload
            state.loading = false
        })
        .addCase(loadNewConversationData.fulfilled, (state, action) => {
            state.user_conversations[action.payload.id] = action.payload.conversation
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

export const userMessageIdsSelector = createSelector(userConversationsSelector, (user_conversations) => Object.values(user_conversations).flatMap((conversationInfo) => Object.keys(conversationInfo.messages))
)

export const userConversationIdsSelector = createSelector(userConversationsSelector, (user_conversations) => Object.keys(user_conversations))
