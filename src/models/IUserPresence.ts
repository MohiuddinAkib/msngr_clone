export interface IUserPresence {
    state: "online" | "offline" | "away";
    last_changed: string;
}