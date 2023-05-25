"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rcon = exports.decode = exports.encode = exports.ResponseType = exports.RequestId = exports.RequestType = void 0;
const emitter_1 = __importDefault(require("./emitter"));
const net_1 = __importDefault(require("net"));
const config_1 = require("./config");
const server_1 = require("./server");
var RequestType;
(function (RequestType) {
    RequestType[RequestType["Auth"] = 3] = "Auth";
    RequestType[RequestType["Exec"] = 2] = "Exec";
})(RequestType = exports.RequestType || (exports.RequestType = {}));
var RequestId;
(function (RequestId) {
    RequestId[RequestId["Auth"] = 291] = "Auth";
    RequestId[RequestId["Exec"] = 801] = "Exec";
})(RequestId = exports.RequestId || (exports.RequestId = {}));
var ResponseType;
(function (ResponseType) {
    ResponseType[ResponseType["Auth"] = 2] = "Auth";
    ResponseType[ResponseType["Exec"] = 0] = "Exec";
})(ResponseType = exports.ResponseType || (exports.ResponseType = {}));
function encode(type, id, body) {
    const size = Buffer.byteLength(body) + 14;
    const buffer = Buffer.alloc(size);
    buffer.writeInt32LE(size - 4, 0);
    buffer.writeInt32LE(id, 4);
    buffer.writeInt32LE(type, 8);
    buffer.write(body, 12, size - 2);
    buffer.writeInt16LE(0, size - 2);
    return buffer;
}
exports.encode = encode;
function decode(chunk) {
    const buffer = Buffer.from(chunk);
    return {
        size: buffer.readInt32LE(0),
        id: buffer.readInt32LE(4),
        type: buffer.readInt32LE(8),
        body: buffer.toString('utf8', 12, buffer.length - 1)
    };
}
exports.decode = decode;
class Rcon {
    config;
    socket;
    authenticated = false;
    queue = [];
    promises = {};
    execId = RequestId.Exec;
    tickInterval;
    emitter = (0, emitter_1.default)();
    on = this.emitter.on;
    off = this.emitter.off;
    nextExecId() {
        return (this.execId += 1);
    }
    listen() {
        this.socket?.on('data', chunk => {
            const packet = decode(chunk);
            switch (packet.type) {
                case ResponseType.Auth:
                    this.authenticated = true;
                    this.emitter.emit('connect');
                    break;
                case ResponseType.Exec:
                    this.promises[packet.id]?.[0](packet.body);
                    break;
                default:
                    console.warn('Unknown packet type\n', packet);
                    break;
            }
        });
    }
    tick() {
        if (this.socket && this.authenticated && this.queue.length) {
            const [msg, resolve, reject] = this.queue.shift();
            const execId = this.nextExecId();
            this.promises[execId] = [resolve, reject];
            this.socket.write(encode(RequestType.Exec, execId, msg));
        }
    }
    send(msg) {
        return new Promise((res, rej) => {
            this.queue.push([msg, res, rej]);
        });
    }
    connect(maxAttempts = 10, attempts = 0) {
        if (this.authenticated)
            throw new Error('Already connected');
        this.socket?.destroy();
        attempts += 1;
        this.socket = net_1.default.connect({
            host: this.config.host,
            port: this.config.port
        }, () => {
            this.listen();
            this.socket?.write(encode(RequestType.Auth, RequestId.Auth, this.config.password));
        });
        this.socket.on('error', (err) => {
            if (maxAttempts && err.code === 'ECONNREFUSED') {
                if (attempts > maxAttempts)
                    return this.emitter.emit('error', `Failed to connect ${maxAttempts} times`);
                this.emitter.emit('warn', 'Failed to connect. Retrying...');
                return setTimeout(() => this.connect(maxAttempts, attempts));
            }
            this.emitter.emit('error', `Failed to connect: ${err.message}`);
        });
        this.tickInterval && clearInterval(this.tickInterval);
        this.tickInterval = setInterval(() => this.tick(), this.config.buffer);
    }
    disconnect() {
        this.socket?.destroy();
        this.socket = undefined;
        this.authenticated = false;
        this.queue = [];
        this.promises = {};
        this.tickInterval && clearInterval(this.tickInterval);
        Object.keys(this.promises).forEach(execId => {
            this.promises[execId][1]('Disconnected');
        });
        this.queue.forEach(promise => promise[2]('Disconnected'));
        this.emitter.emit('disconnect');
    }
    constructor(config) {
        this.config = (0, config_1.LoadDefaults)(config, server_1.DefaultConfig.rcon);
    }
}
exports.Rcon = Rcon;
