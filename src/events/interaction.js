const { createEvent } = require("../../lib/mod");

module.exports = createEvent({
	name: "interactionCreate",
	type: "on",
	execute: async (interaction) => {

		const { options, client, commandName, customId } = interaction;

		if (interaction.isChatInputCommand()) {
			const command = client.chatInputCommands.get(commandName);
			const sub = options.getSubcommand(false);

			if (!command) return;

			if (sub) return void (await command.caller.onSub(interaction));

			return void (await command.caller.execute(interaction));
		}

		if (interaction.isAutocomplete()) {
			const command = client.chatInputCommands.get(commandName);
			if (!command?.caller.onAutoComplete) return;

			return void (await command.caller.onAutoComplete(interaction))
		}

		if (interaction.isUserContextMenuCommand()) {
			const command = client.userContext.get(commandName);
			if (!command) return;

			return void (await command.caller.execute(interaction));
		}

		if (interaction.isMessageContextMenuCommand()) {
			const command = client.messageContext.get(commandName);
			if (!command) return;

			return void (await command.caller.execute(interaction));
		}

		if (interaction.isModalSubmit()) {
			const command = client.modals.get(customId);
			if (!command) return;

			return void (await command.caller.execute(interaction));
		}

		if (interaction.isMessageComponent()) {
			const command = client.components.get(customId);
			if (!command) return;

			return void (await command.caller.execute(interaction));
		}
	}
})
