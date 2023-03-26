import { FunctionParams, FunctionReturn, If } from "../types";
import { Interaction, Guild, ChatInputCommandInteraction, AnySelectMenuInteraction, ButtonInteraction } from "discord.js";

export class InteractionContext<InteractionType extends Interaction, OnDM extends boolean = boolean> {
	constructor(public readonly interaction: InteractionType) {}

	get client() {
		return this.interaction.client;
	}

	get guild() {
		return this.interaction.guild as If<OnDM, undefined, Guild>;
	}
}

export class ChatInputCommandContext<OnDM extends boolean = boolean> extends InteractionContext<ChatInputCommandInteraction, OnDM> {
	reply(...args: FunctionParams<ChatInputCommandInteraction, "reply">): FunctionReturn<ChatInputCommandInteraction, "reply"> {
		return this.interaction.reply(...args);
	}
}

export class ComponentContext<
	InteractionType extends AnySelectMenuInteraction | ButtonInteraction,
	OnDM extends boolean = boolean,
> extends InteractionContext<InteractionType, OnDM> {}

export class ButtonContext<OnDM extends boolean = boolean> extends ComponentContext<ButtonInteraction, OnDM> {}
