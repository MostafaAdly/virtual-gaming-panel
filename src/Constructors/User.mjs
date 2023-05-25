// ==================================== [ Libraries ]
import fs from "fs";
// ==================================== [ Constructor - User ]
export default class User {
    constructor(data) {
        this.data = data;
    }
    config = {
        username: "default",
        credentials: {
            email: "default@vgp.com",
            password:
                "$2b$10$gsSmZ.yOCN2oEyWFxDDF3..wZV415/ObuJQgiPu0ad4kURlyYS/Ea",
        },
        servers: [],
    };
    Load_User(user) {
        this.config = user;
        if (!this.config.servers) this.config.servers = [];
        if (!this.config.id) this.config.id = this.data.uuid();
        return this;
    }
    Load_UserFromFile(filename) {
        if (!filename) return;
        this.Load_User(
            this.data.panel.require(
                `../Database/users/${
                    filename + (filename.endsWith(".json") ? "" : ".json")
                }`
            )
        );
    }
    createConfig() {
        if (!this.isValid()) return;
        this.data.files.createFile(
            `./src/Database/users/${this.config.id}.json`,
            JSON.stringify(this.config),
            (err) => {
                if (err)
                    this.data.error(
                        `Error while creating config for user ${this.print()}`
                    );
            }
        );
        return this;
    }
    print = () => `[${this.config.username}/${this.config.id}]`;
    isValid() {
        return (
            this.config &&
            this.config != {} &&
            this.config.id &&
            this.config.username &&
            this.config.credentials &&
            this.config.credentials.email &&
            this.config.credentials.password
        );
    }
}
