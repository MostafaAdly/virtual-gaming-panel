// ================================================ [ Libraries ]
import * as socketio from "socket.io";
import http from "http";
import express from "express";

// ================================================ [ Consoles Manager ]
export default class ConsolesManager {
    constructor(data) {
        this.data = data;
    }
    establishConnection() {
        this.server = http.createServer(express());
        this.io = new socketio.Server(this.server);
        this.port = process.env.CONSOLES_MANAGER_PORT || 3001;
        this.io.on("connection", (socket) =>
            socket.on("serverCommand", (data) => {
                const server =
                    this.data.panel.loader.ServersManager.getServerById(
                        data.serverId
                    );
                if (server) server.server.do(data.command);
            })
        );

        this.server.listen(
            this.port,
            this.data.print(
                `Consoles Manager is listening on port ${this.data.colors.green(
                    this.port
                )}`
            )
        );
        return this;
    }
}
