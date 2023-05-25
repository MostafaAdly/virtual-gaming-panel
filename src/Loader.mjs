// ======================================== [ Managers ]
import MySQL from "./Managers/MySQLManager.mjs";
import Global from "./Managers/Global.mjs";
import UsersManager from "./Managers/UsersManager.mjs";
import ServersManager from "./Managers/ServersManager.mjs";
// ======================================== [ Libraries ]
import colors from "colors";
import dotenv from "dotenv";

export default class Loader {
    constructor(data) {
        this.data = data;
    }
    initializeLoader() {
        dotenv.config();
        this.data.colors = colors;
    }
    async startLoading() {
        this.Load_Global();
        this.Load_MySQL();
        this.Load_Users();
        await this.Load_Servers();
    }
    Load_Global() {
        this.global = new Global(this.data);
    }
    Load_MySQL = () => (this.data.mysql = new MySQL(this.data));
    Load_Users() {
        this.UsersManager = new UsersManager(this.data);
        this.UsersManager.initialize();
        this.UsersManager.Load_AllUsers();
    }
    async Load_Servers() {
        this.ServersManager = new ServersManager(this.data);
        await this.ServersManager.Load_AllServers();
    }
    Load_UserServers(user) {}
}
