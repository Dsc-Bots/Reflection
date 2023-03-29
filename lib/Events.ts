import { ClientEvents } from "discord.js";
import { Util } from "./utils";

export interface DiscordEvent<Event extends keyof ClientEvents = keyof ClientEvents> {
	name: Event;
	type?: "on" | "once";
	execute: (...args: ClientEvents[Event]) => Promise<void>;
}

export function createEvent<T extends keyof ClientEvents>(data: DiscordEvent<T>): DiscordEvent<T> {
	Util.discordEventValidator(data as unknown as DiscordEvent<keyof ClientEvents>);

	data.type ??= "on";

	return { ...data };
}
