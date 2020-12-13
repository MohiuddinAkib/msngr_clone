import { Message } from "./Message";
import { Participant } from "./Participant";
import { IConversation } from "@src/models/IConversation";

export class Conversation {
    private _participants = [];
    private _lastMessageLoaded = false;
    private _participantsDataLoaded = false;
    private _lastMessageObserver: Function;
    private _participantsDataFetcher: Function;
    private _lastMessageObserverUnsubscribe: () => void;

    constructor(private readonly _id:string, private readonly _conversation: IConversation) {

    }

    setLastMessageObserver(callback: Function) {
        if(!this._lastMessageObserver) {
            this._lastMessageObserver = callback;
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

    get participantsDataLoaded() {
        return this._participantsDataLoaded
    }

    get lastMessageLoaded() {
        return this._lastMessageLoaded
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

    addLastMessageListener(onSuccess: (msg: Message) => void, onError: (error: Error) => void) {
        if(this._lastMessageObserver) {
           this._lastMessageObserverUnsubscribe =  this._lastMessageObserver((msg) => {
            this._lastMessageLoaded = true;
               onSuccess(msg)
            }, onError)
        }

    }

    removeLastMessageListener() {
        if(this._lastMessageObserverUnsubscribe) {
            this._lastMessageObserverUnsubscribe()
        }
    }
}