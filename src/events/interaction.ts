import { AutoCompleteContext, ChatInputCommandContext } from "../index";
import { createEvent } from "../lib/Events";

export default {
	...createEvent({
		name: "interactionCreate",
		type: "on",

		execute: async (interaction) => {
			if (interaction.isChatInputCommand()) {
				const context = new ChatInputCommandContext(interaction);
				const command = context.client.ChatInputCommands.get(interaction.commandName);
				const sub = interaction.options.getSubcommand();

				if (!command) return;

				// @ts-expect-error
				if (sub) return void (await command.caller.onSub(context));

				return void (await command.caller.execute(context));
			}

			if (interaction.isAutocomplete()) {
				const context = new AutoCompleteContext(interaction);
				const command = context.client.ChatInputCommands.get(interaction.commandName);

				if (!command || !command.caller.onAutoComplete) return;

				return void (await command.caller.onAutoComplete(context));
			}

			return;
		},
	}),
};
