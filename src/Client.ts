import { Client, ClientOptions } from "discord.js";
import { join, resolve } from "node:path";
import { ChatInputCommand, ComponentStruct, DiscordEvent } from "./lib/index";
import { HandlingData, HandlerOptions, HandlerInternalOptions } from "./types";
import { Util } from "./utils";

export class HandlerClient<Ready extends boolean = boolean> extends Client<Ready> {
	constructor(options: ClientOptions & HandlerOptions) {
		const { paths, ...djsoptions } = options;
		super(djsoptions);
		this.hop = { paths, events: [] };
		this.ChatInputCommands = new Map<string, HandlingData<ChatInputCommand>>();
		this.components = new Map();
	}

	hop: HandlerInternalOptions;

	async setup(token: string) {
		await this.loadEvents(resolve(__dirname, "events"), true);
		await this.loadChatCommands();
		await this.loadComponents();
		await this.loadEvents();
		await this.login(token);
	}

	private async loadChatCommands(path?: string) {
		path ??= join(process.cwd(), this.hop.paths.chatCommands);
		if (!path.length) {
			throw new Error("No se pueden cargar los comandos sin un path");
		}
		const files = await Util.walk(path, ".js");

		for (const path of files) {
			const caller = (await import(path)) as ChatInputCommand;
			this.ChatInputCommands.set(caller.data.name, { path, caller });
		}
	}

	private async loadComponents(path?: string) {
		if (!(path && this.hop.paths.components)) {
			return;
		}

		path ??= join(process.cwd(), this.hop.paths.components);
		if (!path.length) {
			throw new Error("No se pueden cargar los components sin un path");
		}
		const files = await Util.walk(path, ".js");

		for (const path of files) {
			const caller = (await import(path)) as ComponentStruct;
			this.components.set(caller.customId, { path, caller });
		}
	}

	private async loadEvents(path?: string, instance?: boolean) {
		path ??= join(process.cwd(), this.hop.paths.events);
		if (!path.length) {
			throw new Error("No se pueden cargar los eventos sin un path");
		}
		const files = await Util.walk(path, ".js");

		for (const path of files) {
			let caller = (await import(path)) as DiscordEvent;
			if (instance) caller = Object.entries(caller).flat(1)[1] as DiscordEvent;
			this[caller.type!](caller.name, caller.execute);
		}
	}

	async reloadCommand(commandName: string): Promise<boolean> {
		const getter = this.ChatInputCommands.get(commandName);

		if (!getter) return false;
		const { path } = getter;

		delete require.cache[getter.path];
		const recovery = (await import(getter.path)) as ChatInputCommand;

		this.ChatInputCommands.delete(getter.caller.data.name);
		this.ChatInputCommands.set(recovery.data.name, { path, caller: { ...recovery } });
		return true;
	}
}

declare module "discord.js" {
	export interface Client {
		ChatInputCommands: Map<string, HandlingData<ChatInputCommand>>;
		components: Map<string, HandlingData<ComponentStruct>>;
	}
}
