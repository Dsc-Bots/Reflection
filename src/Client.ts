import { Client, ClientOptions } from "discord.js";
import { join } from "node:path";
import { ChatInputCommand } from "./app/index";
import { CommandData, HandlerOptions } from "./types";
import { Util } from "./utils";

export class HandlerClient<Ready extends boolean = boolean> extends Client<Ready> {
	ChatInputCommands = new Map<string, CommandData<ChatInputCommand>>();
	constructor(options: ClientOptions & HandlerOptions) {
		const { paths, ...djsoptions } = options;
		super(djsoptions);
		this.hop = { paths };
	}

	hop: HandlerOptions;

	async loadChatCommands() {
		const files = await Util.walk(join(process.cwd(), this.hop.paths.chatCommands));

		for (const path of files) {
			const { data, execute } = (await import(path)) as ChatInputCommand;
			this.ChatInputCommands.set(data.name, { path, command: { data, execute } });
		}
	}

	async loadEvents(_path: string) {
		return this;
	}

	async reload(commandName: string): Promise<boolean> {
		const getter = this.ChatInputCommands.get(commandName);

		if (!getter) return false;
		const {
			path,
			command: { data },
		} = getter;

		delete require.cache[getter.path];
		const recovery = (await import(getter.path)) as ChatInputCommand;

		this.ChatInputCommands.set(data.name, { path, command: { ...recovery } });
		return true;
	}
}
