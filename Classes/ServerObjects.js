const shortID = require("shortid");
const Vector3 = require("./Vector3.js");

module.exports = class ServerObject {
    constructor(){
        this.id = shortID.generate();
        this.name = "serverObject";
        this.position = new Vector3();
    }
}