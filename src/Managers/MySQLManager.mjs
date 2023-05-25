import mysql from "mysql";

export default class MySQL {
    constructor(data) {
        this.data = data;
        this.data.line("MySQL");
        this.data.print(`Connecting to MySQL...`, "MySQL");
        this.connect();
        this.createTable();
    }
    connect = () => {
        try {
            this.connection = mysql.createConnection({
                host: process.env.MYSQL_HOST,
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASS,
                database: process.env.MYSQL_DATABASE,
            });
            this.data.print(`MySQL was connected to successfully.`, "MySQL");
        } catch (e) {
            this.data.print(`Failed to connect to MySQL.`, "MySQL");
        }
    };
    async createTable() {}
    disconnect = () => {
        this.connection.destroy;

        this.data.print(`MySQL connection was destroyed.`);
    };
    async MySQL_Query(query, printError, arr = []) {
        return new Promise((res, rej) => {
            this.connection.query(query, arr, (err, rs, ff) => {
                if (printError && err) console.log(err);
                if (err || rs.length <= 0) return res([]);
                return res(rs);
            });
        });
    }
}
