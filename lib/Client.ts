import { ApplicationCommandType, Client, ClientOptions } from "discord.js";
import { join } from "node:path";
import {
	ChatInputCommand,
	MessageComponentStruct,
	DiscordEvent,
	ModalStruct,
	UserCommand,
	MessageCommand,
} from "./mod";
import { HandlingData } from "./types";
import { Util } from "./utils";

export class Bot<Ready extends boolean = boolean> extends Client<Ready> {
	constructor(options: ClientOptions) {
		super(options);
		this.chatInputCommands = new Map();
		this.components = new Map();
		this.modals = new Map();
		this.events = [];
	}

	public async loadSlashCommands(folder?: string) {
		const dir = join(process.cwd(), folder ?? "modals");

		const files = await Util.walk(dir, ".js");

		for (const path of files) {
			const caller = (await import(path)) as ModalStruct;
			this.modals.set(caller.customId, { path, caller });
			console.log(`[Handler] Se har cargado el modal ${caller.customId}`);
		}
	}

	public async loadUserContext(folder?: string) {
		const dir = join(process.cwd(), folder ?? "users");

		const files = await Util.walk(dir, ".js");

		for (const path of files) {
			const caller = (await import(path)) as UserCommand;
			this.userContext.set(caller.data.name, { path, caller });
			console.log(`[Handler] Se ha cargado el UserContext ${caller.data.name}`);
		}
	}

	public async loadMessageContext(folder?: string) {
		const dir = join(process.cwd(), folder ?? "messages");

		const files = await Util.walk(dir, ".js");

		for (const path of files) {
			const caller = (await import(path)) as UserCommand;
			this.userContext.set(caller.data.name, { path, caller });
			console.log(`[Handler] Se ha cargado el MessageContext ${caller.data.name}`);
		}
	}

	public async loadComponents(folder?: string) {
		const dir = join(process.cwd(), folder ?? "components");

		const files = await Util.walk(dir, ".js");

		for (const path of files) {
			const caller = (await import(path)) as MessageComponentStruct;
			this.components.set(caller.customId, { path, caller });
			console.log(`[Handler] Se ha cargado el componente ${caller.customId}`);
		}
	}

	public async loadModals(folder?: string) {
		const dir = join(process.cwd(), folder ?? "modals");

		const files = await Util.walk(dir, ".js");

		for (const path of files) {
			const caller = (await import(path)) as ModalStruct;
			this.modals.set(caller.customId, { path, caller });
			console.log(`[Handler] Se har cargado el modal ${caller.customId}`);
		}
	}

	public async loadEvents(folder?: string) {
		const dir = join(process.cwd(), folder ?? "modals");

		const files = await Util.walk(dir, ".js");

		for (const path of files) {
			const caller = (await import(path)) as DiscordEvent;
			if (Array.isArray(this.events)) this.events.push({ path, caller });
			this[caller.type!](caller.name, async (...args) => await caller.execute(...args));
		}
	}

	public async reloadCommand(commandName: string, type: ApplicationCommandType): Promise<boolean> {
		let getter;

		switch (type) {
			case ApplicationCommandType.ChatInput:
				getter = this.chatInputCommands;
				break;
			case ApplicationCommandType.Message:
				getter = this.messageContext;
				break;
			case ApplicationCommandType.User:
				getter = this.userContext;
				break;
			default:
				return false;
		}

		const command = getter.get(commandName);
		if (!command) return false;
		const { path } = command;

		delete require.cache[path];
		const recovery = (await import(path)) as ChatInputCommand;

		getter.delete(command.caller.data.name);
		// @ts-ignore
		getter.set(recovery.data.name, { path, caller: { ...recovery } });
		return true;
	}

	public async reloadEvent(eventName: string) {
		if (!Array.isArray(this.events)) return false;

		const event = this.events.findIndex((ev) => ev.caller.name === eventName);
		if (!event) return false;

		const {
			caller: { name, execute },
			path,
		} = this.events[event];

		// @ts-ignore
		this.removeListener(name, execute);

		delete require.cache[path];
		const recovery = (await import(path)) as DiscordEvent;

		this[recovery.type!](recovery.name, async (...args) => await recovery.execute(...args));
		this.events[event] = { path, caller: recovery };
		return true;
	}
}

declare module "discord.js" {
	// rome-ignore lint/nursery/noRedeclare: add properties to client
	export interface Client {
		events?: HandlingData<DiscordEvent>[];
		userContext: Map<string, HandlingData<UserCommand>>;
		messageContext: Map<string, HandlingData<MessageCommand>>;
		chatInputCommands: Map<string, HandlingData<ChatInputCommand>>;
		components: Map<string, HandlingData<MessageComponentStruct>>;
		modals: Map<string, HandlingData<ModalStruct>>;
	}
}
