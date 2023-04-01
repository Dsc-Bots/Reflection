const { createEvent } = require("../../lib/mod");

module.exports = createEvent({
	name: "ready",
	type: "once",

	execute: async (client) => {
		console.log(`Logged as ${client.user.username}`);

		await client.application.commands.set(
			[...client.chatInputCommands.values(), ...client.userContext.values(), ...client.messageContext.values()]
				.filter((c) => c)
				.map((c) => c.caller.data),
		);
	},
});
