
export interface IConversation {
    title: string;
    creator_id: string;
    channel_id: string;
    participants: string[];
    type: "private" | "group";
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}