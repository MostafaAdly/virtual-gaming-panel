// =========================================================== [ Managers ]
import WebsiteManager from "../WebsiteManager.mjs";

// =========================================================== [ BackendAPI ]
export default class BackendAPIPage {
    constructor(data, WebsiteManager) {
        this.data = data;
        this.WebsiteManager = WebsiteManager;
        this.data.print("BackendAPI page was loaded.", "Website");
    }
    startGetters() {
        this.WebsiteManager.router.route(`/api/v1/console`).get((req, res) => {
            const servers = [];
            this.WebsiteManager.servers.forEach((server) =>
                servers.push(server.config.id)
            );
            res.json({ servers });
        });

        return this;
    }
}
