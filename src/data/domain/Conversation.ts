import { Participant } from "./Participant";
import { Message, MessageBlock } from "./Message";
import { IParticipant } from "@src/models/IParticipant";
import { IConversation } from "@src/models/IConversation";
import { IUserFormattedMessage, IUserMessage } from "@src/models/IUserMessage";

export class Conversation {
    private _participantsDataLoaded = false;
    private _messages: Record<string, Message>
    private _participantsDataFetcher: Function;
    private _formattedMessages: MessageBlock[]
    private _participants: Record<string, Participant>;

    constructor(private readonly _authId: string, private readonly _id:string, private readonly _conversation: IConversation) {

    }

    setMessages(messages: Record<string, IUserMessage>) {
        if(!this._messages) {
            this._messages = Object.entries(messages).map(([id, message]) => new Message(this._authId, id, message)).reduce((acc, curr) => {
                acc[curr.id] = curr
                return acc
            }, {});
        }
    }

    setParticipants(participants: Record<string, IParticipant>) {
        if(!this._participants) {
            this._participants = Object.entries(participants).map(([id, participant]) => new Participant(this._authId, id, participant)).reduce((acc, curr) => {
                acc[curr.id] = curr
                return acc
            }, {});
        }
    }

    setFormattedMessages(formatterMessages: IUserFormattedMessage[]) {
        if(!this._formattedMessages) {
            this._formattedMessages = formatterMessages
            .map(formattedMessage => ({
                key: formattedMessage.key,
                messages: formattedMessage.messages.map(message => new Message(this._authId, message.id, message))
            }))
            .map(formattedMessage => new MessageBlock(formattedMessage.key, formattedMessage.messages))
        }
    }

    setParticipantsDataFetcher(callback: Function) {
        if(!this._participantsDataFetcher) {
            this._participantsDataFetcher = callback
        }
    }

    getParticipantsData(callback: (participants: Participant[]) => void) {
        if (this._participantsDataFetcher) {
            this._participantsDataFetcher((participants) => {
                callback(participants);
                this._participantsDataLoaded = true;
            })
        }
    }

    get chatPartner () {
        return Object.values(this._participants).filter(participant => participant.id !== this._authId)[0]
    }

    get messages() {
        return this._messages;
    }

    get lastMessage() {
        return Object.values(this._messages).reverse()[0]
    }

    get formattedMessages() {
        return this._formattedMessages
    }

    get participantsDataLoaded() {
        return this._participantsDataLoaded
    }

    get raw() {
        return this._conversation
    }

    get id() {
        return this._id;
    }

    get title() {
        return this._conversation.title
    }

    get creator_id() {
        return this._conversation.creator_id
    }

    get channel_id() {
        return this._conversation.channel_id
    }

    get participantIds() {
        return this._conversation.participants
    }

    get type() {
        return this._conversation.type
    }

    get isPrivateType() {
        return this.type === "private"
    }

    get isGroupType() {
        return !this.isPrivateType && this.type === "group"
    }

    get created_at() {
        return this._conversation.created_at
    }

    get updated_at() {
        return this._conversation.updated_at
    }

    get deleted_at() {
        return this._conversation.deleted_at
    }
}