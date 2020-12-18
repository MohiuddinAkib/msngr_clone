import { IStoreUserConversation } from "@src/types/IStoreUserConversation";
export interface ConversationState {
    loading: boolean;
    selectedConvId: string;
    user_conversations: Record<string, IStoreUserConversation>;
}