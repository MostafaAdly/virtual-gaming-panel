"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinecraftServer = exports.DefaultConfig = void 0;
const child_process_1 = require("child_process");
const emitter_1 = __importDefault(require("./emitter"));
const config_1 = require("./config");
const rcon_1 = require("./rcon");
const loadEula = require("./eula.js").default;
const properties_1 = __importDefault(require("./properties"));
exports.DefaultConfig = {
    jar: "server.jar",
    type: "vanilla",
    path: ".",
    executable: "java",
    args: ["-Xms1G", "-Xmx1G"],
    eula: false,
    properties: {},
    pipeStdout: true,
    pipeStdin: true,
    eventPatterns: config_1.EventPatterns.vanilla,
    port: 25565,
    rcon: {
        host: "localhost",
        port: 25575,
        password: "password",
        buffer: 200,
    },
};
class MinecraftServer {
    config;
    process;
    rcon;
    emitter = (0, emitter_1.default)();
    on = this.emitter.on;
    off = this.emitter.off;
    isOnline = false;
    start(startListeners) {
        if (this.process) return;
        this.initialize();
        if (startListeners) startListeners();
        this.isOnline = true;
        (0, properties_1.default)(this.config);
        this.on("start", () => {
            this.rcon?.connect();
        });
        this.on("stop", () => {
            this.rcon?.disconnect();
        });
        this.process = (0, child_process_1.spawn)(
            this.config.executable,
            [...this.config.args, "-jar", this.config.jar, "nogui"],
            {
                cwd: this.config.path,
                stdio: ["pipe", "pipe", "pipe"],
            }
        );
        if (this.config.pipeStdout) {
            this.process.stdout?.pipe(process.stdout);
            this.process.stderr?.pipe(process.stdout);
        }
        if (this.config.pipeStdin) process.stdin.pipe(this.process.stdin);
        this.process.stdout?.on("data", (chunk) => {
            chunk
                .toString()
                .trim()
                .split(/\n/)
                .forEach((msg) => this.emitter.emit("console", msg));
        });
        process.on("exit", () => {
            this.stop();
        });
        this.process.on("exit", () => {
            this.stop();
        });
        return true;
    }
    // stop() {
    //     this.kill();
    // }
    stop() {
        try {
            this.emitter?.emit("stop");
            this.kill();
        } catch (error) {
            this.kill();
        }
    }
    kill() {
        this.rcon?.disconnect();
        this.rcon = undefined;
        this.process?.kill("SIGTERM");
        this.process = undefined;
        this.emitter.offAll();
        this.isOnline = false;
    }
    send(msg) {
        if (!this.process) return false;
        // if (!this.process) throw new Error("Server not running");
        return this.rcon?.send(msg);
    }
    initializeConfig(config) {
        config.eventPatterns ??=
            config_1.EventPatterns[config.type || "vanilla"] ||
            config_1.EventPatterns.vanilla;
        this.config = (0, config_1.LoadDefaults)(config, exports.DefaultConfig);
    }
    initialize() {
        if (this.rcon) this.kill();
        // if (!this.emitter) {
        //     this.emitter = (0, emitter_1.default)();
        //     this.on()
        // };
        this.rcon = new rcon_1.Rcon(this.config.rcon);
        const eventPatterns = this.config.eventPatterns;
        this.emitter.on("console", (msg) => {
            Object.keys(eventPatterns).forEach((key) => {
                if (msg.match(eventPatterns[key])) {
                    this.emitter.emit(key, msg);
                }
            });
        });
        loadEula(this.config);
    }
}
exports.MinecraftServer = MinecraftServer;
