module.exports = class Connection {
    constructor() {
        this.socket;
        this.player;
        this.server;
        this.lobby;
        this.db;
    }

    //Handles all our io events and where we should route them to be handled
    createEvents() {
        const connection = this;
        const socket = connection.socket;
        const server = connection.server;
        const player = connection.player;
        if (this.db) {
            console.log("We have made a connection to our MongoDB");
        }
        else {
            console.warn("We have not connected to our mongoDB");
        }

        socket.on("disconnect", function () {
            server.onDisconnected(connection);
            connection.DB_deleteRef(connection, connection.player.id);
        });

        socket.on("joinGame", function (unityData) {

            const dataUsername = unityData.username;
            console.log(dataUsername);

            server.onAttemptToJoinGame(connection);
            connection.DB_alterRef(connection, connection.player.id, { "username": dataUsername });
        });

        socket.on("fireBullet", function (unityData) {
            connection.lobby.onFireBullet(connection, unityData);
        });

        socket.on("collisionDestroy", function (unityData) {
            connection.lobby.onCollisionDestroy(connection, unityData);
        });
        socket.on("updatePosition", function (unityData) {
            player.position.x = unityData.position.x;
            player.position.y = unityData.position.y;
            player.position.z = unityData.position.z;

            console.log(player);
            socket.broadcast.to(connection.lobby.id).emit("updatePosition", player);
        });

        socket.on("updateRotation", function (unityData) {
            player.tankRotation = unityData.tankRotation;
            player.barrelRotation = unityData.barrelRotation;

            socket.broadcast.to(connection.lobby.id).emit("updateRotation", player);
        });

        socket.on("fetchUserByToken", function (accessToken) {
            
            connection.DB_getUserByToken(connection, accessToken).then((DB_User) => {

                if(DB_User){
                    console.log("Sending DB_User to Unity");
                    console.log(DB_User);
                    socket.emit("sendUserFromToken", DB_User);
                }
                else{
                    socket.emit("sendUserFromToken", {});
                    console.log("Could not find user with that token");
                }

            }).catch((err) => {
                console.error(err);
            })
        })

        //If we do NOT have a DB reference, create one.
        if (!connection.DB_checkRef(connection, connection.player.id)) {
            connection.DB_createRef(connection, connection.player.id);
        }
    }

    /**
     * This checks if our MongoDB has a stored reference of this connection
     * @param {Connection} connection - Our connection
     * @param {String} playerID - The ID of our connected player (connection.player.id)
     * @returns - Returns true if this connection exists within the Database, false if not
     */
    DB_checkRef(connection = Connection, playerID = String) {
        const db = require("../models");

        db.Player.find({ connection_id: playerID }, (err, data) => {
            if (err) throw err;

            if (data.length > 0) {
                return true;
            }
            else {
                return false;
            }
        })
    }

    DB_alterRef(connection = Connection, playerID = String, alterData = Object) {
        const db = require("../models");

        db.Player.update(
            { connection_id: playerID },
            { $set: alterData }
        ).then((data) => {
            console.log(data);
            console.log("Successfully updated player data");
        })
    }

    DB_getUserByToken(connection = Connection, accessToken) {
        const db = require("../models");

        return new Promise(function (resolve, reject) {

            db.User.find(
                { accessToken : connection.trimWeirdChars(accessToken.accessToken)}
            )
                .then((data) => {
                    console.log(data);
                    if(data.length > 0){
                        resolve(data[0]);
                    }
                    else{
                        resolve(null);
                    }
                })
                .catch((err) => reject(err));
        })
    }

    /**
     * 
     * @param {String} string - Takes a string and trims weird characters.
     * @returns a string without weird characters
     */
    trimWeirdChars(string = String){
        let returnString = string.split("");

        returnString = returnString.filter((char) => {
            const charCode = char.charCodeAt(0);

            if(charCode >= 32 && charCode <= 126){
                return true;
            }
            else{
                return false;
            }
        })
        
        returnString = returnString.join("").trim();

        return returnString;
    }


    /**
     * This creates a reference to our Mongo DB for this connection, based on the player's ID
     * @param {Connection} connection - Our connection
     * @param {String} playerID - The ID of our connected player (connection.player.id)
     */
    DB_createRef(connection = Connection, playerID = String) {
        const db = require("../models");

        db.Player.create({
            connection_id: playerID,
            username: connection.player.username,
            connected: true
        }).then((data) => {
            console.log("created reference to the player");
        })
    }

    /**
     * 
     * @param {Connection} connection - The connection (player) disconnecting from the game server.
     * @param {String} playerID - The ID of the player, from the connection (connection.player.id)
     */
    DB_deleteRef(connection = Connection, playerID = String) {
        const db = require("../models");

        db.Player.deleteOne({
            connection_id: playerID
        }).then((data) => {
            console.log(`"Removed reference to the player, ${playerID}"`);
        })
    }
}