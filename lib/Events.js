"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEvent = void 0;
const utils_1 = require("./utils");
function createEvent(data) {
    utils_1.Util.discordEventValidator(data);
    data.type ??= "on";
    return { ...data };
}
exports.createEvent = createEvent;
