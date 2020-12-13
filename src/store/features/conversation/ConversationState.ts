import { IConversation } from "@src/models/IConversation";

export interface ConversationState {
    selectedConvId: string;
    user_conversations: Record<string, IConversation>;
}