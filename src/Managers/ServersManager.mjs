// ======================================== [ Libraries ]
import fs from "fs";
// ======================================== [ Constructors ]
import MinecraftServer from "../Constructors/MinecraftServer.mjs";

// ======================================== [ ServersManager ]
export default class ServersManager {
    constructor(data) {
        this.data = data;
        this.servers = [];
        this.usedPorts = [];
    }
    async Load_AllServers() {
        await fs
            .readdirSync("./src/Database/servers/")
            .forEach((id) => this.Load_Server(id));
        // await this.createServer();
    }
    async Load_Server(serverId) {
        if (!this.isValidServerAndFolders(serverId)) return;
        const server = new MinecraftServer(
            this.data,
            this.data.panel.require(
                `./Database/servers/${serverId}/config.json`
            )
        );
        if (!server) return;
        this.servers.push(server);
        await this.initializeAndStartServer(serverId);
    }
    async initializeAndStartServer(serverId) {
        const server = this.getServerById(serverId);
        if (!server) return;
        await server.initializeAndStart();
    }
    isValidServerAndFolders(serverId) {
        return (
            serverId &&
            !serverId.startsWith("-") &&
            fs.existsSync(`./src/Database/servers/${serverId}`) &&
            fs.existsSync(`./src/Database/servers/${serverId}/server`) &&
            fs.existsSync(`./src/Database/servers/${serverId}/config.json`) &&
            this.isServerJarExists(serverId)
        );
    }
    async createServer(config) {
        const server = new MinecraftServer(this.data, config);
        await server.createFilesAndFolders();
        setTimeout(() => {
            server.initializeAndStart();
            this.servers.push(server);
        }, 700);
    }
    isServerJarExists(serverId) {
        return this.data.files.exists(
            `./src/Database/servers/${serverId}/server/` +
                (
                    this.requireOrNull(
                        `./Database/servers/${serverId}/config.json`
                    ) || { properties: { jar: "spigot_188.jar" } }
                ).properties.jar
        );
    }
    isPortUsed(port) {
        return this.usedPorts.includes(port) ? this.isPortUsed(port + 1) : port;
    }
    usePort(ports) {
        ports.forEach((port) => {
            if (!this.usedPorts.includes(port)) this.usedPorts.push(port);
        });
    }
    getServerById = (serverId) =>
        this.servers.filter((server) => server.config.id == serverId)[0];
    requireOrNull(file) {
        try {
            return this.data.panel.require(file);
        } catch (error) {
            return null;
        }
    }
}
