import { ClientEvents } from "discord.js";
export interface DiscordEvent<Event extends keyof ClientEvents = keyof ClientEvents> {
    name: Event;
    type?: "on" | "once";
    execute: (...args: ClientEvents[Event]) => Promise<void>;
}
export declare function createEvent<T extends keyof ClientEvents>(data: DiscordEvent<T>): DiscordEvent<T>;
