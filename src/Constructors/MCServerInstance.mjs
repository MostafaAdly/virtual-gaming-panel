// ================================================================ [ Libraries ]
import pidusage from "pidusage";
// ================================================================ [ Minecraft Server Initializer - BACKEND ]
import * as Minecraft from "../MinecraftInitializer/index.js";
// ================================================================ [ Minecraft Server Instance ]
export default class MCServerInstance extends Minecraft.MinecraftServer {
    constructor(data, serverData) {
        super();
        this.data = data;
        this.serverData = serverData;
        this.status = "Stopped";
        this.resourceUsage = {};
        this.initializeConfig(serverData.properties);
        this.handlePorts();
        this.console = [];
        setInterval(async () => {
            this.resourceUsage = await pidusage(process.pid);
            this.sendCurrentData();
        }, 5000);
    }
    startListeners() {
        this.on("start", () => {
            this.status = "Started";
            this.sendCurrentData();
        });

        this.on("stop", () => {
            this.status = "Stopped";
            this.sendCurrentData();
        });
        this.on("console", (msg) => {
            this.console.push(msg);
            this.sendCurrentData();
        });
    }
    startServer() {
        this.data.print(
            this.data.colors.green("Starting") +
                ` server [id='${this.data.colors.green(
                    this.serverData.id
                )}', port='${this.data.colors.yellow(
                    this.config.port
                )}', rcon='${this.data.colors.yellow(this.config.rcon.port)}']`
        );
        this.startListeners();
        this.status = this.start() ? "Starting" : "Started";
        this.sendCurrentData();
    }
    stopServer(kill) {
        this?.data?.print(
            this.data?.colors?.red(kill ? "Killing" : "Stopping") +
                ` server [id='${this.data.colors.green(
                    this.serverData.id
                )}', port='${this.data.colors.yellow(
                    this.config.port
                )}', rcon='${this.data.colors.yellow(this.config.rcon.port)}']`
        );
        if (kill) {
            try {
                this.do("stop");
                setTimeout(() => {
                    this?.stop();
                }, 2500);
            } catch (error) {
                this?.stop();
            }
        } else this?.do("stop");
        this.status = kill ? "Killed" : "Stopped";
        this?.sendCurrentData();
    }
    getResourceUsage() {
        return new Promise((resolve, reject) => {
            pidusage(this.process.pid).then((req, res) => {
                resolve(res);
            });
        });
    }
    do(command) {
        switch (command) {
            case "$panel:start":
                this?.startServer();
                break;
            case "$panel:kill":
                this?.stopServer(true);
                break;
            case "$panel:stop":
                this?.stopServer(false);
                break;
            default:
                this?.send(command)?.then((res) => this?.sendCurrentData());
                break;
        }
    }
    sendCurrentData = () =>
        this.data?.panel?.ConsolesManager?.io?.emit(
            "serverUpdate",
            this.getCurrentData()
        );
    getCurrentData = () => {
        return {
            serverId: this.serverData.id,
            consoleArray: this.console,
            status: this.status,
            resourceUsage: this.resourceUsage,
        };
    };
    handlePorts() {
        this.config.port = this.data.panel.loader.ServersManager.isPortUsed(
            this.config.port
        );
        this.config.rcon.port =
            this.data.panel.loader.ServersManager.isPortUsed(
                this.config.rcon.port,
                true,
                this.config.path
            );
    }
}
// server
//     .send("ban herobrine")
//     .then((response) => {
//         console.log("Command result: ", response);
//     })
//     .catch((err) => console.log("Failed to run command", err));
