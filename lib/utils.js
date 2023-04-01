"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
class Util {
    static async walk(path, filter) {
        const files = await (0, promises_1.readdir)(path, { withFileTypes: true });
        const result = [];
        for (const file of files) {
            const filePath = (0, node_path_1.join)(path, file.name);
            if (file.isDirectory()) {
                result.push(...(await Util.walk(filePath)));
                continue;
            }
            result.push(filePath);
        }
        if (filter?.length)
            return result.filter((f) => f.endsWith(filter));
        return result;
    }
    static chatCommandValidator(obj) {
        if (obj.execute.length < 1) {
            throw new Error(`El comando [${obj.data.name}] tiene menos de 1 argumento en su funcion execute`);
        }
        if (obj.onAutoComplete && obj.onAutoComplete.length < 1) {
            throw new Error(`El comando [${obj.data.name}] tiene menos de 1 argumento en su funcion onAutoComplete`);
        }
        if (obj.onSub && obj.onSub.length < 1) {
            throw new Error(`El comando [${obj.data.name}] tiene menos de 1 argumento en su funcion onSub`);
        }
    }
    static discordEventValidator(obj) {
        if (obj.execute.length < 1) {
            throw new Error(`El evento [${obj.name}] tiene menos de 1 argumento en su funcion execute`);
        }
    }
    static discordComponentValidator(obj) {
        if (obj.execute.length < 1) {
            throw new Error(`El componente [${obj.customId}] tiene menos de 1 argumento en su funcion execute`);
        }
        if (obj.customId.length < 1) {
            throw new Error(`El componente [${obj.customId} ???] no puede tener su customId vacia`);
        }
    }
}
exports.Util = Util;
