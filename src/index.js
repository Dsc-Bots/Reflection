require("dotenv").config();
const { IntentsBitField } = require("discord.js");
const { Bot } = require("../lib/mod");

const client = new Bot({ intents: [IntentsBitField.Flags.Guilds] });

async function setup() {
	await client.loadSlashCommands();
	await client.loadEvents();

	await client.login(process.env.DISCORD_TOKEN);
}

setup();
