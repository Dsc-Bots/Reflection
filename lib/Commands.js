"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessageCommand = exports.createUserCommand = exports.createChatCommand = void 0;
const discord_js_1 = require("discord.js");
const utils_1 = require("./utils");
function createChatCommand(command) {
    utils_1.Util.chatCommandValidator(command);
    return { ...command };
}
exports.createChatCommand = createChatCommand;
function createUserCommand({ data, execute, }) {
    if (execute.length < 1) {
        throw new Error(`El comando [${data.name}] tiene menos de 1 argumento en su funcion execute`);
    }
    data.type = discord_js_1.ApplicationCommandType.User;
    return { data, execute };
}
exports.createUserCommand = createUserCommand;
function createMessageCommand({ data, execute, }) {
    if (execute.length < 1) {
        throw new Error(`El comando [${data.name}}] tiene menos de 1 argumento en su funcion execute`);
    }
    data.type = discord_js_1.ApplicationCommandType.Message;
    return { data, execute };
}
exports.createMessageCommand = createMessageCommand;
