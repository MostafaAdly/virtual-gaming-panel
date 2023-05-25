// ===================================== [ Handlers ]
import Loader from "./Loader.mjs";
import WebsiteManager from "./Website/WebsiteManager.mjs";
import ConsolesManager from "./Managers/ConsolesManager.mjs";
import FilesManager from "./Managers/FilesManager.mjs";
import { createRequire } from "module";
// ===================================== [ Virtual Gaming Panel ]
export default class Panel {
    constructor() {
        this.data = { panel: this, files: new FilesManager(this.data) };
        this.require = createRequire(import.meta.url);
    }
    initialize() {
        (async () => {
            this.startLoader();
        })();
        this.startWebsite();
        this.startListeners();
    }
    async startLoader() {
        this.loader = new Loader(this.data);
        this.loader.initializeLoader();
        await this.loader.startLoading();
    }
    startListeners() {
        // this.websiteManager.listen();
    }
    startWebsite() {
        this.ConsolesManager = new ConsolesManager(
            this.data
        ).establishConnection();
        this.websiteManager = new WebsiteManager(this.data);
        this.websiteManager.initialize();
        this.websiteManager.startNextJSApplication();
        this.websiteManager.Load_Partials();
    }
}
