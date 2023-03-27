import { AnySelectMenuInteraction, ButtonInteraction } from "discord.js";
import { Util } from "../utils";
import { ComponentContext } from "./index";

export interface ComponentStruct<T extends AnySelectMenuInteraction | ButtonInteraction = AnySelectMenuInteraction | ButtonInteraction> {
	customId: string;
	execute: (interaction: ComponentContext<T>) => Promise<void>;
}

export function createComponent<T extends ComponentStruct<ButtonInteraction>>(data: T): T;
export function createComponent<T extends ComponentStruct<AnySelectMenuInteraction>>(data: T): T;
export function createComponent<T extends ComponentStruct>(data: T): T {
	Util.discordComponentValidator(data);
	return data;
}
