import { FunctionParams, FunctionReturn, If } from "../types";
import {
	Interaction,
	Guild,
	ChatInputCommandInteraction,
	AnySelectMenuInteraction,
	ButtonInteraction,
	AutocompleteInteraction,
	MessageComponentInteraction,
} from "discord.js";

export class InteractionContext<InteractionType extends Interaction, OnDM extends boolean = boolean> {
	constructor(public readonly interaction: InteractionType) {}

	get client() {
		return this.interaction.client;
	}

	get guild() {
		return this.interaction.guild as If<OnDM, Guild | null, Guild>;
	}
}

export class AutoCompleteContext<OnDM extends boolean = boolean> extends InteractionContext<AutocompleteInteraction, OnDM> {
	respond(...args: FunctionParams<AutocompleteInteraction, "respond">): FunctionReturn<AutocompleteInteraction, "respond"> {
		return this.interaction.respond(...args);
	}
}

export class ChatInputCommandContext<OnDM extends boolean = boolean> extends InteractionContext<ChatInputCommandInteraction, OnDM> {
	reply(...args: FunctionParams<ChatInputCommandInteraction, "reply">): FunctionReturn<ChatInputCommandInteraction, "reply"> {
		return this.interaction.reply(...args);
	}
}

export class ComponentContext<
	InteractionType extends AnySelectMenuInteraction | ButtonInteraction,
> extends InteractionContext<InteractionType> {
	update(...args: FunctionParams<MessageComponentInteraction, "update">): FunctionReturn<MessageComponentInteraction, "reply"> {
		return this.interaction.update(...args);
	}
}

export class ButtonContext extends ComponentContext<ButtonInteraction> {}
