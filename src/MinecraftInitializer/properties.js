"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
var CoreKey;
(function (CoreKey) {
    CoreKey["port"] = "server-port";
    CoreKey["rcon"] = "rcon.port";
    CoreKey["password"] = "rcon.password";
    CoreKey["enableRcon"] = "enable-rcon";
})(CoreKey || (CoreKey = {}));
;
function loadProperties(config) {
    const filePath = (0, path_1.join)(config.path, 'server.properties');
    const serverProperties = {};
    const coreProperties = {
        port: config.port,
        rcon: config.rcon.port,
        password: config.rcon.password,
        enableRcon: true
    };
    Object.keys(config.properties).forEach(key => {
        serverProperties[key] = config.properties[key];
    });
    Object.keys(coreProperties).forEach(key => {
        serverProperties[CoreKey[key]] = coreProperties[key];
    });
    fs_1.default.writeFileSync(filePath, Object.keys(serverProperties)
        .map(key => `${key}=${serverProperties[key]}`)
        .join('\n'), {
        flag: 'w',
        encoding: 'utf-8'
    });
}
exports.default = loadProperties;
