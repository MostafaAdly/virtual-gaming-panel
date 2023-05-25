// ======================================= [ Libraries ]
import bcrypt from "bcrypt";
import fs from "fs";
// ======================================= [ Constructors ]
import User from "../Constructors/User.mjs";
// ======================================= [ UsersManager ]
export default class UsersManager {
    constructor(data) {
        this.data = data;
        this.users = [];
    }
    initialize() {
        this.PasswordsManager = new this.PasswordsManager(this.data);
        this.hashPassword = this.PasswordsManager.hashPassword;
        this.comparePassword = this.PasswordsManager.comparePassword;
    }
    Load_AllUsers() {
        fs.readdirSync("./src/Database/users/").forEach((file) => {
            this.Load_User(this.data.panel.require("./Database/users/" + file));
        });
    }
    Load_User(userData) {
        const user = new User(this.data);
        if (!user.Load_User(userData).isValid())
            return this.data.error(`User is not valid to load ${user.print()}`);
        this.users.push(user);
        return user;
    }
    async createNewUser(userData) {
        if (
            !userData ||
            !userData.username ||
            !userData.email ||
            !userData.password
        ) {
            this.data.error(
                `Error while creating new user [${
                    JSON.stringify(userData) || "null userData input"
                }]`
            );
            return null;
        }
        const password = await this.hashPassword(userData.password);
        if (!password) {
            this.data.error(
                `Error while hashing password for new User [${JSON.stringify(
                    userData
                )}]`
            );
            return null;
        }
        const user = this.Load_User({
            id: userData.id || this.data.uuid(),
            username: userData.username,
            credentials: {
                email: userData.email,
                password,
            },
        });
        return user.createConfig();
    }
    PasswordsManager = class PasswordsManager {
        constructor(data) {
            this.data = data;
            this.salt = 10;
        }
        hashPassword = async (pass) =>
            (await bcrypt.hash(pass, this.salt || 10)) || null;
        comparePassword = async (pass, hashed) =>
            await bcrypt.compare(pass, hashed);
    };
}
