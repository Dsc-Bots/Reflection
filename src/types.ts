import { ChatInputApplicationCommandData, UserApplicationCommandData } from "discord.js";

export type If<T extends boolean, A, B = null> = T extends true ? A : T extends false ? B : A | B;
export type propertyIsTrue<T, K extends keyof T> = T[K] extends boolean ? (T[K] extends true ? true : false) : never;

export type isFunction<T> = T extends (...args: any) => any ? T : never;
export type FunctionParams<T, K extends keyof T> = Parameters<isFunction<T[K]>>;
export type FunctionReturn<T, K extends keyof T> = ReturnType<isFunction<T[K]>>;

export interface HandlerOptions {
	paths: { chatCommands: string; events: string };
}

export interface CommandData<CommandType> {
	command: CommandType;
	path: string;
}

export type ChatCommandData = ChatInputApplicationCommandData;
export type UserCommandData = UserApplicationCommandData;
