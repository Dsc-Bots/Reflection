import { ApplicationCommandType, Client, ClientOptions } from "discord.js";
import { ChatInputCommand, MessageComponentStruct, DiscordEvent, ModalStruct, UserCommand, MessageCommand } from "./mod";
import { HandlingData } from "./types";
export declare class Bot<Ready extends boolean = boolean> extends Client<Ready> {
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
declare module "discord.js" {
    interface Client {
        events?: HandlingData<DiscordEvent>[];
        userContext: Map<string, HandlingData<UserCommand>>;
        messageContext: Map<string, HandlingData<MessageCommand>>;
        chatInputCommands: Map<string, HandlingData<ChatInputCommand>>;
        components: Map<string, HandlingData<MessageComponentStruct>>;
        modals: Map<string, HandlingData<ModalStruct>>;
    }
}
