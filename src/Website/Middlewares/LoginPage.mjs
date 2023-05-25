import WebsiteManager from "../WebsiteManager.mjs";

export default class LoginPage {
    constructor(data, WebsiteManager) {
        this.data = data;
        this.WebsiteManager = WebsiteManager;
        this.data.print("Login page was loaded.", "Website");
    }
    start(routes) {
        routes.forEach(this.get);
        return this;
    }
    get(route) {
        route.get((req, res) => {
            res.send("login");
        });
    }
}
