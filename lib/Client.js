"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const discord_js_1 = require("discord.js");
const node_path_1 = require("node:path");
const utils_1 = require("./utils");
class Bot extends discord_js_1.Client {
    constructor(options) {
        super(options);
        this.chatInputCommands = new Map();
        this.components = new Map();
        this.modals = new Map();
        this.userContext = new Map();
        this.messageContext = new Map();
        this.events = [];
    }
    async loadSlashCommands(folder) {
        const dir = (0, node_path_1.join)(process.cwd(), folder ?? "commands");
        const files = await utils_1.Util.walk(dir, ".js");
        for (const path of files) {
            const caller = (await Promise.resolve(`${path}`).then(s => __importStar(require(s))));
            this.chatInputCommands.set(caller.data.name, { path, caller });
            console.log(`[Handler] Se ha cargado el comando ${caller.data.name}`);
        }
    }
    async loadUserContext(folder) {
        const dir = (0, node_path_1.join)(process.cwd(), folder ?? "users");
        const files = await utils_1.Util.walk(dir, ".js");
        for (const path of files) {
            const caller = (await Promise.resolve(`${path}`).then(s => __importStar(require(s))));
            this.userContext.set(caller.data.name, { path, caller });
            console.log(`[Handler] Se ha cargado el UserContext ${caller.data.name}`);
        }
    }
    async loadMessageContext(folder) {
        const dir = (0, node_path_1.join)(process.cwd(), folder ?? "messages");
        const files = await utils_1.Util.walk(dir, ".js");
        for (const path of files) {
            const caller = (await Promise.resolve(`${path}`).then(s => __importStar(require(s))));
            this.userContext.set(caller.data.name, { path, caller });
            console.log(`[Handler] Se ha cargado el MessageContext ${caller.data.name}`);
        }
    }
    async loadComponents(folder) {
        const dir = (0, node_path_1.join)(process.cwd(), folder ?? "components");
        const files = await utils_1.Util.walk(dir, ".js");
        for (const path of files) {
            const caller = (await Promise.resolve(`${path}`).then(s => __importStar(require(s))));
            this.components.set(caller.customId, { path, caller });
            console.log(`[Handler] Se ha cargado el componente ${caller.customId}`);
        }
    }
    async loadModals(folder) {
        const dir = (0, node_path_1.join)(process.cwd(), folder ?? "modals");
        const files = await utils_1.Util.walk(dir, ".js");
        for (const path of files) {
            const caller = (await Promise.resolve(`${path}`).then(s => __importStar(require(s))));
            this.modals.set(caller.customId, { path, caller });
            console.log(`[Handler] Se har cargado el modal ${caller.customId}`);
        }
    }
    async loadEvents(folder) {
        const dir = (0, node_path_1.join)(process.cwd(), folder ?? "events");
        const files = await utils_1.Util.walk(dir, ".js");
        for (const path of files) {
            const caller = (await Promise.resolve(`${path}`).then(s => __importStar(require(s))));
            if (Array.isArray(this.events))
                this.events.push({ path, caller });
            this[caller.type](caller.name, async (...args) => await caller.execute(...args));
            console.log(`[Handler] Se ha cargado el evento ${caller.name}`);
        }
    }
    async reloadCommand(commandName, type) {
        let getter;
        switch (type) {
            case discord_js_1.ApplicationCommandType.ChatInput:
                getter = this.chatInputCommands;
                break;
            case discord_js_1.ApplicationCommandType.Message:
                getter = this.messageContext;
                break;
            case discord_js_1.ApplicationCommandType.User:
                getter = this.userContext;
                break;
            default:
                return false;
        }
        const command = getter.get(commandName);
        if (!command)
            return false;
        const { path } = command;
        delete require.cache[path];
        const recovery = (await Promise.resolve(`${path}`).then(s => __importStar(require(s))));
        getter.delete(command.caller.data.name);
        // @ts-ignore
        getter.set(recovery.data.name, { path, caller: { ...recovery } });
        return true;
    }
    async reloadEvent(eventName) {
        if (!Array.isArray(this.events))
            return false;
        const event = this.events.findIndex((ev) => ev.caller.name === eventName);
        if (!event)
            return false;
        const { caller: { name, execute }, path, } = this.events[event];
        // @ts-ignore
        this.removeListener(name, execute);
        delete require.cache[path];
        const recovery = (await Promise.resolve(`${path}`).then(s => __importStar(require(s))));
        this[recovery.type](recovery.name, async (...args) => await recovery.execute(...args));
        this.events[event] = { path, caller: recovery };
        return true;
    }
}
exports.Bot = Bot;
