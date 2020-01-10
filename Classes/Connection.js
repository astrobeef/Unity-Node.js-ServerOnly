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
            connection.DB_alterRef(connection, connection.player.id, {"username" : dataUsername});
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

            socket.broadcast.to(connection.lobby.id).emit("updatePosition", player);
        });

        socket.on("updateRotation", function (unityData) {
            player.tankRotation = unityData.tankRotation;
            player.barrelRotation = unityData.barrelRotation;

            socket.broadcast.to(connection.lobby.id).emit("updateRotation", player);
        });

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
            {connection_id : playerID},
            {$set: alterData}
        ).then((data) => {
            console.log(data);
            console.log("Successfully updated player data");
        })
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