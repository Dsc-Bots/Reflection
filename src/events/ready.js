const { createEvent } = require("../../lib/mod");

module.exports = createEvent({
	name: "ready",
	type: "once",

	execute: (client) => {
		console.log(`Logged as ${client.user.name}`);
	},
});
