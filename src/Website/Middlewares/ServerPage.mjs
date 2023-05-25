export default class ServerPage {
    constructor(data, WebsiteManager, server) {
        this.data = data;
        this.WebsiteManager = WebsiteManager;
        this.server = server;
        this.data.print(
            `Console page[${server.config.id}] was loaded.`,
            "Website"
        );
    }
    start(routes) {
        routes.forEach((r) => this.route(r));
    }
    route(route) {
        route.get((req, res) => {
            this.WebsiteManager.next.render(req, res, "/F_ConsolePage", {
                server: this.server.server.getCurrentData(),
            });
        });
    }
    server = {};
}
