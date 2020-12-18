import { IParticipant } from "@src/models/IParticipant";
import { IConversation } from "@src/models/IConversation";
import { IUserFormattedMessage, IUserMessage } from "@src/models/IUserMessage";

export interface IStoreUserConversation {
    data: IConversation;
    messages: Record<string, IUserMessage>;
    participants: Record<string, IParticipant>;
    formatted_messages: IUserFormattedMessage[];
}