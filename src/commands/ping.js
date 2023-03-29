const { createChatCommand } = require("../../lib/mod");

module.exports = createChatCommand({
	data: {
		name: "ping",
		description: "Respondo con mi ping",
	},

	execute: async (interaction) => {
		const reply = await interaction.reply({ content: "Ping!", fetchReply: true });

		const ms = Date.now() - reply.createdTimestamp;

		await interaction.editReply({ content: `Pong! \`${ms}ms\`` });
	},
});
