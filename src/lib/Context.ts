import { FunctionParams, FunctionReturn, If } from "../types";
import {
	Interaction,
	Guild,
	ChatInputCommandInteraction,
	AnySelectMenuInteraction,
	ButtonInteraction,
	AutocompleteInteraction,
	MessageComponentInteraction,
	ModalSubmitInteraction,
} from "discord.js";

export class AllInteractionContext<InteractionType extends Interaction, OnDM extends boolean = boolean> {
	constructor(public readonly interaction: InteractionType) {}

	get client() {
		return this.interaction.client;
	}

	get guild() {
		return this.interaction.guild as If<OnDM, Guild | null, Guild>;
	}
}

export class AutoCompleteContext<OnDM extends boolean = boolean> extends AllInteractionContext<AutocompleteInteraction, OnDM> {
	respond(...args: FunctionParams<AutocompleteInteraction, "respond">): FunctionReturn<AutocompleteInteraction, "respond"> {
		return this.interaction.respond(...args);
	}
}

export class InteractionContext<
	InteractionType extends Exclude<Interaction, AutocompleteInteraction>,
	OnDM extends boolean = boolean,
> extends AllInteractionContext<InteractionType, OnDM> {
	reply(args: FunctionParams<InteractionType, "reply">[0]): FunctionReturn<Exclude<Interaction, AutocompleteInteraction>, "reply"> {
		return this.interaction.reply(args);
	}
}

export class ChatInputCommandContext<OnDM extends boolean = boolean> extends InteractionContext<ChatInputCommandInteraction, OnDM> {
	showModal(...args: FunctionParams<ChatInputCommandInteraction, "showModal">): FunctionReturn<ChatInputCommandInteraction, "showModal"> {
		return this.interaction.showModal(...args);
	}
}

export type SupportComponents = ModalSubmitInteraction | AnySelectMenuInteraction | ButtonInteraction;

export class ComponentContext<InteractionType extends SupportComponents,> extends AllInteractionContext<InteractionType> {
	get customId(): string {
		return this.interaction.customId;
	}

	deferUpdate(...args: FunctionParams<SupportComponents, "deferUpdate">): FunctionReturn<SupportComponents, "deferUpdate"> {
		return this.interaction.deferUpdate(...args);
	}
}

export class MessageComponentContext<
	InteractionType extends AnySelectMenuInteraction | ButtonInteraction,
> extends ComponentContext<InteractionType> {
	update(...args: FunctionParams<MessageComponentInteraction, "update">): FunctionReturn<MessageComponentInteraction, "reply"> {
		return this.interaction.update(...args);
	}

	showModal(...args: FunctionParams<MessageComponentInteraction, "showModal">): FunctionReturn<MessageComponentInteraction, "showModal"> {
		return this.interaction.showModal(...args);
	}
}

export class ModalComponentContext extends ComponentContext<ModalSubmitInteraction> {}
