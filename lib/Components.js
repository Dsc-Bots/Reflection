"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModal = exports.createComponent = void 0;
const utils_1 = require("./utils");
function createComponent(data) {
    utils_1.Util.discordComponentValidator(data);
    return data;
}
exports.createComponent = createComponent;
function createModal(data) {
    utils_1.Util.discordComponentValidator(data);
    return data;
}
exports.createModal = createModal;
