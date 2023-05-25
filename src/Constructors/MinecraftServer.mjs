// ============================================ [ Libraries ]
import path from "path";
// ============================================ [ Constructors ]
import MCServerInstance from "./MCServerInstance.mjs";
// ============================================ [ MinecraftServer ]
export default class MinecraftServer {
    constructor(data, config = this.config) {
        this.data = data;
        this.config = this.checkConfig(config);
        this.isValidAndFix();
    }
    config = {
        id: null,
        name: "default",
        version: "1.8.8",
        properties: {
            jar: "spigot_188.jar",
            args: ["-Xms512M", "-Xmx1G"],
            eula: true,
            pipeStdout: false, // for logging the console
            properties: {
                motd: "Minecraft server",
                "max-players": 10,
            },
        },
        databases: [],
    };
    async initializeAndStart() {
        await this.initializeServer();
        this.data.panel.websiteManager.Load_Server(this);
        return this;
    }
    async initializeServer() {
        this.createFilesAndFolders();
        this.server = new MCServerInstance(this.data, this.config);
        this.data.panel.loader.ServersManager.usePort([
            this.server.config.port,
            this.server.config.rcon.port,
        ]);
        this.startServer();
    }
    startServer() {
        if (!this.server) return;
        this.server.do("$panel:start");
    }
    Load_Server(config) {
        isValidAndFix();
        if (!config) this.config = { ...this.config, config };
    }
    checkConfig(config) {
        if (config) this.config = config;
        else this.config = { id: this.data.uuid.small(), ...this.config };
        if (!this.config.id) this.config.id = this.data.uuid.small();
        if (!this.config.properties.path)
            this.config.properties.path = `./src/Database/servers/${this.config.id}/server`;
        return this.config;
    }
    async createFilesAndFolders() {
        if (!this.data.files.exists(`./src/Database/servers/${this.config.id}`))
            this.data.files.createFolder(
                `./src/Database/servers/${this.config.id}`
            );
        if (
            !this.data.files.exists(
                `./src/Database/servers/${this.config.id}/config.json`
            )
        )
            this.data.files.createFile(
                `./src/Database/servers/${this.config.id}/config.json`,
                JSON.stringify(this.config)
            );

        if (
            !this.data.files.exists(
                `./src/Database/servers/${this.config.id}/server`
            )
        )
            this.data.files.createFolder(
                `./src/Database/servers/${this.config.id}/server`
            );
        if (
            !this.data.files.exists(
                `./src/Database/servers/${this.config.id}/server/${this.config.properties.jar}.jar`
            )
        )
            await this.data.files.copyFile(
                `./src/Instances/${this.config.properties.jar}`,
                `./src/Database/servers/${this.config.id}/server/${this.config.properties.jar}`
            );
        if (
            !this.data.files.exists(
                `./src/Database/servers/${this.config.id}/server/eula.txt`
            )
        )
            this.data.files.createFile(
                `./src/Database/servers/${this.config.id}/server/eula.txt`,
                "eula=true"
            );
        return this;
    }
    isValidAndFix() {
        if (!this.config) return;
        if (!this.config.id) this.config.id = this.data.uuid.small();
    }
}
