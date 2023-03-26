import { ChatInputCommandContext } from "./index";
import { ChatCommandData, CommandData, propertyIsTrue, UserCommandData } from "../types";
import { join } from "node:path";
import { ApplicationCommandType, ApplicationCommandData } from "discord.js";
import { Util } from "../utils";

export interface CommandStruct<DataType extends ApplicationCommandData> {
	data: DataType;
	execute: (interaction: ChatInputCommandContext<propertyIsTrue<DataType, "dmPermission">>) => Promise<void>;
	onAutoComplete?: (...args: any) => any;
}

export interface CommandWithSubStruct<DataType extends ChatCommandData> extends CommandStruct<DataType> {
	onSub: (interaction: ChatInputCommandContext<propertyIsTrue<DataType, "dmPermission">>) => Promise<void>;
}

export type ChatInputCommand = CommandStruct<ChatCommandData>;
export type UserCommand = CommandStruct<UserCommandData>;

export function createChatCommand<T extends ChatCommandData>(command: CommandStruct<T>): CommandData<ChatInputCommand> {
	Util.chatCommandValidator(command);

	return { path: join(__dirname, __filename), command };
}

export function createChatCommandWithSubCommands<T extends ChatCommandData>(
	command: CommandWithSubStruct<T>,
): CommandData<ChatInputCommand> {
	Util.chatCommandValidator(command);
	return { path: join(__dirname, __filename), command };
}

export function createUserCommand<T extends UserCommandData>({ data, execute }: CommandStruct<T>): CommandData<UserCommand> {
	if (execute.length < 1) {
		throw new Error(`El comando [${__filename}] tiene menos de 1 argumento en su funcion execute`);
	}

	data.type = ApplicationCommandType.User;

	return { path: join(__dirname, __filename), command: { data, execute } };
}
