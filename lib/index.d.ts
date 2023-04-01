declare module "types" {
    import { ChatInputApplicationCommandData, MessageApplicationCommandData, UserApplicationCommandData } from "discord.js";
    export type If<T extends boolean, A, B = null> = T extends true ? A : T extends false ? B : A | B;
    export type propertyIsTrue<T, K extends keyof T> = T[K] extends boolean ? (T[K] extends true ? true : false) : never;
    export type isFunction<T> = T extends (...args: any) => any ? T : never;
    export type FunctionParams<T, K extends keyof T> = Parameters<isFunction<T[K]>>;
    export type FunctionReturn<T, K extends keyof T> = ReturnType<isFunction<T[K]>>;
    export interface PathConfig {
        chatCommands: string;
        events?: string;
        components?: string;
        modals?: string;
    }
    export interface HandlingData<DataType> {
        caller: DataType;
        path: string;
    }
    export type ChatCommandData = ChatInputApplicationCommandData;
    export type UserCommandData = UserApplicationCommandData;
    export type MessageCommandData = MessageApplicationCommandData;
}
declare module "utils" {
    import { ClientEvents } from "discord.js";
    import { ChatCommandData, CommandStruct, CommandWithSubStruct, DiscordEvent, MessageComponentStruct, ModalStruct } from "mod";
    export class Util {
        static walk(path: string, filter?: string): Promise<string[]>;
        static chatCommandValidator(obj: CommandStruct<ChatCommandData>): void;
        static chatCommandValidator(obj: CommandWithSubStruct<ChatCommandData>): void;
        static discordEventValidator(obj: DiscordEvent<keyof ClientEvents>): void;
        static discordComponentValidator(obj: MessageComponentStruct | ModalStruct): void;
    }
}
declare module "Commands" {
    import { ChatCommandData, MessageCommandData, UserCommandData } from "types";
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
    export function createChatCommand<T extends ChatCommandData>(command: CommandWithSubStruct<T, ChatInputCommandInteraction>): ChatInputCommand;
    export function createChatCommand<T extends ChatCommandData>(command: CommandStruct<T, ChatInputCommandInteraction>): ChatInputCommand;
    export function createUserCommand<T extends UserCommandData>({ data, execute, }: CommandStruct<T, UserContextMenuCommandInteraction>): UserCommand;
    export function createMessageCommand<T extends MessageCommandData>({ data, execute, }: Omit<CommandStruct<T, MessageContextMenuCommandInteraction>, "onAutoComplete">): MessageCommand;
}
declare module "Events" {
    import { ClientEvents } from "discord.js";
    export interface DiscordEvent<Event extends keyof ClientEvents = keyof ClientEvents> {
        name: Event;
        type?: "on" | "once";
        execute: (...args: ClientEvents[Event]) => Promise<void>;
    }
    export function createEvent<T extends keyof ClientEvents>(data: DiscordEvent<T>): DiscordEvent<T>;
}
declare module "Components" {
    import { AnySelectMenuInteraction, ButtonInteraction, ModalSubmitInteraction } from "discord.js";
    export interface MessageComponentStruct<T extends AnySelectMenuInteraction | ButtonInteraction = AnySelectMenuInteraction | ButtonInteraction> {
        customId: string;
        execute: (context: T) => Promise<void>;
    }
    export interface ModalStruct {
        customId: string;
        execute: (context: ModalSubmitInteraction) => Promise<void>;
    }
    export function createComponent<T extends MessageComponentStruct<ButtonInteraction>>(data: T): T;
    export function createComponent<T extends MessageComponentStruct<AnySelectMenuInteraction>>(data: T): T;
    export function createModal<T extends ModalStruct>(data: T): T;
}
declare module "mod" {
    export * from "Commands";
    export * from "Events";
    export * from "Components";
    export * from "types";
    export * from "utils";
    export * from "Client";
}
declare module "Client" {
    import { ApplicationCommandType, Client, ClientOptions } from "discord.js";
    import { ChatInputCommand, MessageComponentStruct, DiscordEvent, ModalStruct, UserCommand, MessageCommand } from "mod";
    import { HandlingData } from "types";
    export class Bot<Ready extends boolean = boolean> extends Client<Ready> {
        constructor(options: ClientOptions);
        loadSlashCommands(folder?: string): Promise<void>;
        loadUserContext(folder?: string): Promise<void>;
        loadMessageContext(folder?: string): Promise<void>;
        loadComponents(folder?: string): Promise<void>;
        loadModals(folder?: string): Promise<void>;
        loadEvents(folder?: string): Promise<void>;
        reloadCommand(commandName: string, type: ApplicationCommandType): Promise<boolean>;
        reloadEvent(eventName: string): Promise<boolean>;
    }
    module "discord.js" {
        interface Client {
            events?: HandlingData<DiscordEvent>[];
            userContext: Map<string, HandlingData<UserCommand>>;
            messageContext: Map<string, HandlingData<MessageCommand>>;
            chatInputCommands: Map<string, HandlingData<ChatInputCommand>>;
            components: Map<string, HandlingData<MessageComponentStruct>>;
            modals: Map<string, HandlingData<ModalStruct>>;
        }
    }
}
