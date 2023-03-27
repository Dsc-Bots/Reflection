import { ChatInputApplicationCommandData, MessageApplicationCommandData, UserApplicationCommandData } from "discord.js";
import { DiscordEvent } from "./lib";

export type If<T extends boolean, A, B = null> = T extends true ? A : T extends false ? B : A | B;
export type propertyIsTrue<T, K extends keyof T> = T[K] extends boolean ? (T[K] extends true ? true : false) : never;

export type isFunction<T> = T extends (...args: any) => any ? T : never;
export type FunctionParams<T, K extends keyof T> = Parameters<isFunction<T[K]>>;
export type FunctionReturn<T, K extends keyof T> = ReturnType<isFunction<T[K]>>;


export interface HandlerInternalOptions {
	paths: PathConfig;
	events: HandlingData<DiscordEvent>[];
}

export interface PathConfig {
	chatCommands: string;
	events?: string;
	components?: string;
	modals?: string;
}

export type HandlerOptions = Pick<HandlerInternalOptions, "paths">;

export interface HandlingData<DataType> {
	caller: DataType;
	path: string;
}

export type ChatCommandData = ChatInputApplicationCommandData;
export type UserCommandData = UserApplicationCommandData;
export type ContextCommandData = MessageApplicationCommandData;
