"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const server = new _1.MinecraftServer({
    jar: 'paper.jar',
    path: 'B:/servers/minecraft/node-test',
    args: ['-Xms4G', '-Xmx4G'],
    eula: true,
    pipeStdout: false
});
server.on('start', () => {
    console.log('Server successfully started!');
});
server.on('stop', () => {
    console.log('Server stopped');
});
server.rcon.on('connect', () => {
    console.log('Rcon successfully connected');
});
server.start();
const cmd = 'op ignwombat';
server.on('console', console.log);
server.send(cmd).then(response => {
    console.log('COMMAND RESULT: ', response);
});
