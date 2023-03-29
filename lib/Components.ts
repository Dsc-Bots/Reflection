import { AnySelectMenuInteraction, ButtonInteraction, ModalSubmitInteraction } from "discord.js";
import { Util } from "./utils";

export interface MessageComponentStruct<
	T extends AnySelectMenuInteraction | ButtonInteraction = AnySelectMenuInteraction | ButtonInteraction,
> {
	customId: string;
	execute: (context: T) => Promise<void>;
}

export interface ModalStruct {
	customId: string;
	execute: (context: ModalSubmitInteraction) => Promise<void>;
}

export function createComponent<T extends MessageComponentStruct<ButtonInteraction>>(data: T): T;
export function createComponent<T extends MessageComponentStruct<AnySelectMenuInteraction>>(data: T): T;
export function createComponent<T extends MessageComponentStruct>(data: T): T {
	Util.discordComponentValidator(data);
	return data;
}

export function createModal<T extends ModalStruct>(data: T): T {
	Util.discordComponentValidator(data);
	return data;
}
