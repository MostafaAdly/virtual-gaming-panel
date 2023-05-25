// ======================================== [ Libraries ]
import fs from "fs";
// ======================================== [ Files Manager ]
export default class FilesManager {
    constructor(data) {
        this.data = data;
    }
    createFolder(folder, callback) {
        fs.mkdir(folder, callback || (() => {}));
    }
    exists(file) {
        return fs.existsSync(file);
    }
    createFile(file, content, callback) {
        fs.writeFileSync(file, content, {
            flag: "w",
            encoding: "utf-8",
        });
    }
    deleteFile(file) {
        try {
            fs.unlinkSync(file);
        } catch (error) {}
    }
    async copyFile(from, to, callback) {
        await fs.copyFile(
            from,
            to,
            callback ||
                ((err) => {
                    if (err) throw err;
                })
        );
    }
}
