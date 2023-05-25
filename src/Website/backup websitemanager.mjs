// ========================================== [ Libraries ]
import express from "express";
import jsx from "express-react-views";
import path from "path";
import hbs from "hbs";
import fs from "fs";
// ========================================== [ Pages ]
import BackendAPIPage from "./Middlewares/BackendAPIPage.mjs";
import LoginPage from "./Middlewares/LoginPage.mjs";
import HomePage from "./Middlewares/HomePage.mjs";
import ServerPage from "./Middlewares/ServerPage.mjs";
// ========================================== [ WebsiteManager ]
export default class WebsiteManager {
    constructor(data) {
        this.data = data;
        this.servers = [];
    }
    initialize() {
        this.data.line("Website");
        this.views = path.join(process.cwd(), "views");
        // ================================= App initializer
        this.app = express();
        this.port = process.env.WEBSITE_PORT || 3000;
        // ================================= Router initializer
        this.router = express.Router();
        // ================================= Middlewares Handler
        this.app.use(express.static("./views"));
        this.app.use(express.json());
        this.app.use("/", this.router);
        // ================================= Engine
        this.app.set("view engine", "jsx");
        this.app.engine("jsx", jsx.createEngine());
        this.app.set("views", this.views);
        this.data.print(`Views folder was set to ['${this.views}']`);
        // this.app.set("views", path.join(process.cwd(), "/src/Website/views"));
    }
    startPages() {
        this.LoginPage = new LoginPage(this.data, this).start([
            this.getRoute("/login"),
        ]);
        this.HomePage = new HomePage(this.data, this).start([
            this.getRoute("/"),
            this.getRoute("/home"),
        ]);
        this.BackendAPIPage = new BackendAPIPage(
            this.data,
            this
        ).startGetters();
    }
    listen = () =>
        this.app.listen(
            this.port,
            this.data.print(
                `Website is now available on ${this.data.colors.green(
                    this.port
                )}`,
                "Website"
            )
        );
    Load_Server(server) {
        this.servers = this.data.panel.loader.ServersManager.servers;
        server.website = new ServerPage(this.data, this, server);
        server.website.start([this.getRoute(`/server/${server.config.id}`)]);
    }
    Load_Partials() {
        const partialsDir = path.join(this.views, "partials");
        fs.readdirSync(partialsDir).forEach((filename) => {
            var matches = /^([^.]+).hbs$/.exec(filename);
            if (!matches) return;
            var name = matches[1];
            var template = fs.readFileSync(
                partialsDir + "/" + filename,
                "utf8"
            );
            this.data.print(`Registering partial ['${name}', '${filename}']`);
            hbs.registerPartial(name, template);
        });
    }
    getRoute = (route) => this.router.route(route);
}
