import { AnySelectMenuInteraction, ButtonInteraction, ModalSubmitInteraction } from "discord.js";
export interface MessageComponentStruct<T extends AnySelectMenuInteraction | ButtonInteraction = AnySelectMenuInteraction | ButtonInteraction> {
    customId: string;
    execute: (context: T) => Promise<void>;
}
export interface ModalStruct {
    customId: string;
    execute: (context: ModalSubmitInteraction) => Promise<void>;
}
export declare function createComponent<T extends MessageComponentStruct<ButtonInteraction>>(data: T): T;
export declare function createComponent<T extends MessageComponentStruct<AnySelectMenuInteraction>>(data: T): T;
export declare function createModal<T extends ModalStruct>(data: T): T;
