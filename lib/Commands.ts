import { ChatCommandData, MessageCommandData, UserCommandData } from "./types";
import {
	ApplicationCommandType,
	ApplicationCommandData,
	CommandInteraction,
	ChatInputCommandInteraction,
	UserContextMenuCommandInteraction,
	MessageContextMenuCommandInteraction,
	AutocompleteInteraction,
} from "discord.js";
import { Util } from "./utils";

export interface CommandContextStruct<
	DataType extends ApplicationCommandData,
	InteractionType extends CommandInteraction = ChatInputCommandInteraction,
> {
	data: DataType;
	execute: (interaction: InteractionType) => Promise<void>;
}

export interface CommandStruct<
	DataType extends ApplicationCommandData,
	InteractionType extends CommandInteraction = ChatInputCommandInteraction,
> extends CommandContextStruct<DataType, InteractionType> {
	onAutoComplete?: (interaction: AutocompleteInteraction) => Promise<void>;
}

export interface CommandWithSubStruct<
	DataType extends ApplicationCommandData,
	InteractionType extends CommandInteraction = ChatInputCommandInteraction,
> extends CommandStruct<DataType, InteractionType> {
	onSub: (interaction: InteractionType) => Promise<void>;
}

export type ChatInputCommand = CommandStruct<ChatCommandData, ChatInputCommandInteraction>;
export type UserCommand = CommandStruct<UserCommandData, UserContextMenuCommandInteraction>;
export type MessageCommand = CommandStruct<MessageCommandData, MessageContextMenuCommandInteraction>;

export function createChatCommand<T extends ChatCommandData>(
	command: CommandWithSubStruct<T, ChatInputCommandInteraction>,
): ChatInputCommand;
export function createChatCommand<T extends ChatCommandData>(
	command: CommandStruct<T, ChatInputCommandInteraction>,
): ChatInputCommand;
export function createChatCommand<T extends ChatCommandData>(
	command: CommandStruct<T, ChatInputCommandInteraction> | CommandWithSubStruct<T, ChatInputCommandInteraction>,
): ChatInputCommand {
	Util.chatCommandValidator(command);

	return { ...command };
}

export function createUserCommand<T extends UserCommandData>({
	data,
	execute,
}: CommandStruct<T, UserContextMenuCommandInteraction>): UserCommand {
	if (execute.length < 1) {
		throw new Error(`El comando [${data.name}] tiene menos de 1 argumento en su funcion execute`);
	}

	data.type = ApplicationCommandType.User;

	return { data, execute };
}

export function createMessageCommand<T extends MessageCommandData>({
	data,
	execute,
}: Omit<CommandStruct<T, MessageContextMenuCommandInteraction>, "onAutoComplete">): MessageCommand {
	if (execute.length < 1) {
		throw new Error(`El comando [${data.name}}] tiene menos de 1 argumento en su funcion execute`);
	}

	data.type = ApplicationCommandType.Message;

	return { data, execute };
}
