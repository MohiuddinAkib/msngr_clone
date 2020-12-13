import moment from "moment";
import  ntvEmojiRegex from "emoji-regex";
import allEmojiData from "emoji-mart/data/all.json";
import reactStringReplace from "react-string-replace";
import { IUserMessage } from "@src/models/IUserMessage";
import {  BaseEmoji, EmojiSet, getEmojiDataFromNative } from "emoji-mart";

export class Message{
    constructor(private readonly _authId: string, private readonly _messageId: string, private readonly _message: IUserMessage) {

    }

    get raw() {
        return this._message
    }

    get id() {
        return this._messageId;
    }
    
    get messageContent() {
        return this._message.message;
    };

    get isMyMessage() {
        return this.sender_id === this._authId
    }

    get isOthersMessage() {
        return !this.isMyMessage
    }

    get isFileType() {
        return this.type === "file"
    }

    get isGifType() {
        return this.type === "gif"
    }

    get isTextType() {
        return this.type === "text"
    }

    get type() {
        return this._message.type
    }

    get sender_id() {
        return this._message.sender_id
    };

    get name() {
        return this._message.name
    }

    get size () {
        return this._message.size
    };
    
    get fullPath () {
        return this._message.fullPath
    } ;

    get downloadURL () {
        return this._message.downloadURL
    } ;

    get contentType () {
        return this._message.contentType
    } 

    get hasImageFile() {
        return this.isFileType && this.contentType === "image/jpeg"
    }

    get hasVideoFile() {
        return this.isFileType && this.contentType === "video/webm;codecs=vp8"
    }

    get hasAudioFile() {
        return this.isFileType && this.contentType === "audio/webm;codecs=opus"
    }

    get customMetadata () {
        return this._message.customMetadata
    };

    get created_at() {
        return this._message.created_at;
    };

    get created_at_fcalendar() {
        return moment(this.created_at).calendar({
            sameDay: "h:mm",
            lastDay: "[Yesterday]",
            lastWeek: "[Last] dddd",
            sameElse: "DD MMM",
          })
    }

    get deleted_at () {
        return this._message.deleted_at
    } ;

    get updated_at () {
        return this._message.updated_at
    }

    replaceEmojisFromMessageContentWith(callback: (emojidata: BaseEmoji, index: number) => any, emojiSet: EmojiSet = "facebook") {
        const ntvRegex = ntvEmojiRegex();
        const emojis = [];
        let match;

        while (
          (match = ntvRegex.exec(
            this.messageContent as string
          ))
        ) {
          const [emoji] = match;
          emojis.push(emoji);
        }

        const regex2 = emojis.join("|");

        return !emojis.length
            ? this.messageContent
            : reactStringReplace(
                this.messageContent as string,
                regex2,
                (match, i) => {
                const emojiData = getEmojiDataFromNative(
                    match,
                    emojiSet,
                    allEmojiData as any
                );

                return callback(emojiData, i)
                }
            );
    }
}

export class MessageBlock {
    constructor(private readonly _key: string, private _messages: Message[]) {

    }

    get key() {
        return this._key
    }

    get isMine() {
        return this.messages[0].isMyMessage
    }

    get messages() {
        return this._messages;
    }
}