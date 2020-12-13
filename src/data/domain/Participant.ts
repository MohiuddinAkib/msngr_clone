import { IParticipant } from "@src/models/IParticipant";

export class Participant {
    constructor(private readonly _authId: string, private readonly _id: string, private readonly _participant: IParticipant) {

    }

    get id() { return this._id;}

    get isMe() { return this._id === this._authId;}

    get nickname() {
        return this._participant.nickname;
    }

    get type() {
        return this._participant.type;
    }

    get isAdmin() {
        return this.type === "admin"
    }

    get raw() {
        return this._participant
    }
}