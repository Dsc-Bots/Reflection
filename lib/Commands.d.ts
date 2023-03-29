import { ChatCommandData, MessageCommandData, UserCommandData } from "./types";
import { ApplicationCommandData, CommandInteraction, ChatInputCommandInteraction, UserContextMenuCommandInteraction, MessageContextMenuCommandInteraction, AutocompleteInteraction } from "discord.js";
export interface CommandContextStruct<DataType extends ApplicationCommandData, InteractionType extends CommandInteraction = ChatInputCommandInteraction> {
    data: DataType;
    execute: (interaction: InteractionType) => Promise<void>;
}
export interface CommandStruct<DataType extends ApplicationCommandData, InteractionType extends CommandInteraction = ChatInputCommandInteraction> extends CommandContextStruct<DataType, InteractionType> {
    onAutoComplete?: (interaction: AutocompleteInteraction) => Promise<void>;
}
export interface CommandWithSubStruct<DataType extends ApplicationCommandData, InteractionType extends CommandInteraction = ChatInputCommandInteraction> extends CommandStruct<DataType, InteractionType> {
    onSub: (interaction: InteractionType) => Promise<void>;
}
export type ChatInputCommand = CommandStruct<ChatCommandData, ChatInputCommandInteraction>;
export type UserCommand = CommandStruct<UserCommandData, UserContextMenuCommandInteraction>;
export type MessageCommand = CommandStruct<MessageCommandData, MessageContextMenuCommandInteraction>;
export declare function createChatCommand<T extends ChatCommandData>(command: CommandWithSubStruct<T, ChatInputCommandInteraction>): ChatInputCommand;
export declare function createChatCommand<T extends ChatCommandData>(command: CommandStruct<T, ChatInputCommandInteraction>): ChatInputCommand;
export declare function createUserCommand<T extends UserCommandData>({ data, execute, }: CommandStruct<T, UserContextMenuCommandInteraction>): UserCommand;
export declare function createMessageCommand<T extends MessageCommandData>({ data, execute, }: Omit<CommandStruct<T, MessageContextMenuCommandInteraction>, "onAutoComplete">): MessageCommand;
