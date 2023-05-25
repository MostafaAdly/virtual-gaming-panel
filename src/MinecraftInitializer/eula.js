"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
function loadEula(config) {
    const filePath = (0, path_1.join)(config.path, 'eula.txt');
    fs_1.default.writeFileSync(filePath, `eula=${config.eula}`, {
        flag: 'w',
        encoding: 'utf-8'
    });
}
exports.default = loadEula;
