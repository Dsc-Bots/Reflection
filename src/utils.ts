import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { ChatCommandData, CommandStruct, CommandWithSubStruct } from "./index";

export class Util {
	static async walk(path: string): Promise<string[]> {
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

		return result;
	}

	static chatCommandValidator(obj: CommandStruct<ChatCommandData>): void;
	static chatCommandValidator(obj: CommandWithSubStruct<ChatCommandData>): void;
	static chatCommandValidator(obj: CommandStruct<ChatCommandData> & CommandWithSubStruct<ChatCommandData>): void {
		if (obj.execute.length < 1) {
			throw new Error(`El comando [${__filename}] tiene menos de 1 argumento en su funcion execute`);
		}

		if (obj.onAutoComplete && obj.onAutoComplete.length < 1) {
			throw new Error(`El comando [${__filename}] tiene menos de 1 argumento en su funcion onAutoComplete`);
		}

		if (obj.onSub && obj.onSub.length < 1) {
			throw new Error(`El comando [${__filename}] tiene menos de 1 argumento en su funcion onSub`);
		}
	}
}
