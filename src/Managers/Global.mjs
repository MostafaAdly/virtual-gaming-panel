// ====================================== [ Libraries ]
import dateFormat from "dateformat";
import { v4 as uuid } from "uuid";

// ====================================== [ Global ]
export default class Global {
    constructor(data) {
        this.data = data;
        this.initialize();
    }
    initialize() {
        this.data.print = (msg, name = "Global") =>
            console.log(
                `${
                    name
                        ? this.countSpaces("", 3) +
                          this.data.colors.cyan("[" + name + "]") +
                          this.countSpaces(name, 12)
                        : ""
                }${dateFormat(Date.now())} - ${msg}`
            );
        this.data.line = (name) =>
            this.data.print(
                `--------- ${this.data.colors.red(name)} ---------`,
                name
            );
        this.data.error = (msg, name) =>
            this.data.print(this.data.colors.red(msg), name);
        this.data.uuid = uuid;
        this.data.uuid.small = () => this.data.uuid().toString().split("-")[0];
    }
    countSpaces(word = "", amount = 0) {
        let whiteSpaces = "";
        for (let i = 0; i < Math.abs(amount - word.length); i++)
            whiteSpaces += " ";
        return whiteSpaces;
    }
}
