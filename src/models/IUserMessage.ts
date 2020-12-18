import IGif from "@giphy/js-types/dist/gif";

export interface IUserMessage {
    type: "text" | "gif" | "file";
    message: string | IGif;
    sender_id: string;
    created_at: string;
    name?: string;
    size?: number;
    fullPath?: string;
    downloadURL?: string;
    contentType?: "image/jpeg" | "video/webm;codecs=vp8" | "audio/webm;codecs=opus";
    customMetadata?: Object;
    deleted_at: string | null;
    updated_at?: string
}

export interface IUserFormattedMessage {
    key: string;
    messages: ({id: string} & IUserMessage)[]
}