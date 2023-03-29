import { ClientEvents } from "discord.js";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { ChatCommandData, CommandStruct, CommandWithSubStruct, DiscordEvent, MessageComponentStruct, ModalStruct } from "./mod";

export class Util {
	static async walk(path: string, filter?: string): Promise<string[]> {
		const files = await readdir(path, { withFileTypes: true });
		const result: string[] = [];

		for (const file of files) {
			const filePath = join(path, file.name);
			if (file.isDirectory()) {
				result.push(...(await Util.walk(filePath)));
				continue;
			}

			result.push(filePath);
		}

		if (filter?.length) return result.filter((f) => f.endsWith(filter));

		return result;
	}

	static chatCommandValidator(obj: CommandStruct<ChatCommandData>): void;
	static chatCommandValidator(obj: CommandWithSubStruct<ChatCommandData>): void;
	static chatCommandValidator(obj: CommandStruct<ChatCommandData> & CommandWithSubStruct<ChatCommandData>): void {
		if (obj.execute.length < 1) {
			throw new Error(`El comando [${obj.data.name}] tiene menos de 1 argumento en su funcion execute`);
		}

		if (obj.onAutoComplete && obj.onAutoComplete.length < 1) {
			throw new Error(`El comando [${obj.data.name}] tiene menos de 1 argumento en su funcion onAutoComplete`);
		}

		if (obj.onSub && obj.onSub.length < 1) {
			throw new Error(`El comando [${obj.data.name}] tiene menos de 1 argumento en su funcion onSub`);
		}
	}

	static discordEventValidator(obj: DiscordEvent<keyof ClientEvents>): void {
		if (obj.execute.length < 1) {
			throw new Error(`El evento [${obj.name}] tiene menos de 1 argumento en su funcion execute`);
		}
	}

	static discordComponentValidator(obj: MessageComponentStruct | ModalStruct): void {
		if (obj.execute.length < 1) {
			throw new Error(`El componente [${obj.customId}] tiene menos de 1 argumento en su funcion execute`);
		}

		if (obj.customId.length < 1) {
			throw new Error(`El componente [${obj.customId} ???] no puede tener su customId vacia`);
		}
	}
}
