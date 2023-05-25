export default class PermissionsManager {
    constructor(data) {
        this.data = data;
    }
    fullPermissions = [
        "*",
        "MYSQL_ACCESS",
        "CREATE_DATABASE",
        "START_SERVER",
        "STOP_SERVER",
        "SEND_COMMANDS",
        "DELETE_SERVER",
        "USERS_ADD",
        "USERS_REMOVE",
    ];
}
