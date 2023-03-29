import { ClientEvents } from "discord.js";
import { ChatCommandData, CommandStruct, CommandWithSubStruct, DiscordEvent, MessageComponentStruct, ModalStruct } from "./mod";
export declare class Util {
    static walk(path: string, filter?: string): Promise<string[]>;
    static chatCommandValidator(obj: CommandStruct<ChatCommandData>): void;
    static chatCommandValidator(obj: CommandWithSubStruct<ChatCommandData>): void;
    static discordEventValidator(obj: DiscordEvent<keyof ClientEvents>): void;
    static discordComponentValidator(obj: MessageComponentStruct | ModalStruct): void;
}
