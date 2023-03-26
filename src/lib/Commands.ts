import { AutoCompleteContext, ChatInputCommandContext } from "./index";
import { ChatCommandData, ContextCommandData, propertyIsTrue, UserCommandData } from "../types";
import { ApplicationCommandType, ApplicationCommandData } from "discord.js";
import { Util } from "../utils";

export interface CommandContextStruct<DataType extends ApplicationCommandData> {
	data: DataType;
	execute: (interaction: ChatInputCommandContext<propertyIsTrue<DataType, "dmPermission">>) => Promise<void>;
}

export interface CommandStruct<DataType extends ApplicationCommandData> extends CommandContextStruct<DataType> {
	onAutoComplete?: (interaction: AutoCompleteContext<propertyIsTrue<DataType, "dmPermission">>) => Promise<void>;
}

export interface CommandWithSubStruct<DataType extends ChatCommandData> extends CommandStruct<DataType> {
	onSub: (interaction: ChatInputCommandContext<propertyIsTrue<DataType, "dmPermission">>) => Promise<void>;
}

export type ChatInputCommand = CommandStruct<ChatCommandData>;
export type UserCommand = CommandStruct<UserCommandData>;
export type ContextMenuCommand = CommandStruct<ContextCommandData>;

export function createChatCommand<T extends ChatCommandData>(command: CommandWithSubStruct<T>): ChatInputCommand;
export function createChatCommand<T extends ChatCommandData>(command: CommandStruct<T>): ChatInputCommand;
export function createChatCommand<T extends ChatCommandData>(
	command: CommandStruct<T> | CommandWithSubStruct<T>,
): ChatInputCommand {
	Util.chatCommandValidator(command, __filename);

	return { ...command };
}

export function createUserCommand<T extends UserCommandData>({ data, execute }: CommandStruct<T>): UserCommand {
	if (execute.length < 1) {
		throw new Error(`El comando [${__filename}] tiene menos de 1 argumento en su funcion execute`);
	}

	data.type = ApplicationCommandType.User;

	return { data, execute };
}

export function createContextCommand<T extends ContextCommandData>({
	data,
	execute,
}: Omit<CommandStruct<T>, "onAutoComplete">): ContextMenuCommand {
	if (execute.length < 1) {
		throw new Error(`El comando [${__filename}] tiene menos de 1 argumento en su funcion execute`);
	}

	data.type = ApplicationCommandType.Message;

	return { data, execute };
}
