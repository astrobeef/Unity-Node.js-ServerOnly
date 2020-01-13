
const API = require("./API/API");

module.exports = class Connection {
    constructor() {
        this.socket;
        this.player;
        this.server;
        this.lobby;
    }

    /*----------------------------------------*/
    /*----- CREATE EVENTS FOR CONNECTION -----*/
    /*----------------------------------------*/

    //Handles all our io events and where we should route them to be handled
    createEvents() {
        const connection = this;
        const socket = connection.socket;
        const server = connection.server;
        const player = connection.player;

        socket.on("disconnect", function () {
            server.onDisconnected(connection);
            API.deletePlayer(connection.player.id);
        });

        socket.on("joinGame", function (unityData) {

            const dataUsername = unityData.username;
            console.log(dataUsername);

            server.onAttemptToJoinGame(connection);
            API.updatePlayer(connection.player.id, { "username": dataUsername }).catch(err => console.error(err));
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

        socket.on("fetchUserByToken", function (accessToken) {
            DB_handleUserByTokenFetch(connection, accessToken).catch(err => console.error(err));
        });

        socket.on("sendMessage", function(message){
            DB_handleMessageSend(message).catch(err => console.error(err));
        })

        socket.on("newMessage", () => {
            console.log("A message has been sent by another user.");

            DB_handleNewMessage().catch(err => console.error(err));
        })

        //If we do NOT have a DB reference, create one.
        DB_checkRef(connection.player.id).then((foundRef) => {
            if (!foundRef) {
                API.createPlayer(connection.player.username, connection.player.id)
                    .then(creationInfo => console.log(creationInfo))
                    .catch(error => console.error(error));
            }
        }).catch(err => console.log(err));
    }
}

/*---------------------------*/
/*----- HANDLER METHODS -----*/
/*---------------------------*/

/**
 * Promise - Emits event if user is found.  Emits empty event if not.
 * @param {Connection} connection - Our current connection.
 * @param {String} accessToken - The accessToken sent from Unity client.
 * @returns Promise true/false if user is found.
 */
function DB_handleUserByTokenFetch(connection = Connection, accessToken = String) {

    return new Promise((resolve, reject) => {
        API.getUserByToken(accessToken).then((DB_User) => {

            if (DB_User) {
                connection.socket.emit("sendUserFromToken", DB_User);
                resolve(true);
            }
            else {
                connection.socket.emit("sendUserFromToken", {});
                console.warn("Could not find user with that token");
                resolve(false);
            }

        }).catch((err) => {
            console.error(err);
            reject(err);
        })
    })
}

function DB_handleMessageSend(message){
    return new Promise((resolve, reject) => {
        API.sendMessage(connection.player.username, message).then(creationInfo => {
            console.log(creationInfo);

            //Do something now that we've sent the message.
            //Emit broadcast that a message has been sent.
            console.log("Emit broadcast that a message has been sent");
            resolve(true);

        }).catch(err => {
            
            console.error("The message could not be sent");

            reject(err);
        });
    })
}

function DB_handleNewMessage(){
    return new Promise((resolve, reject) => {
        API.getMessages().then(DB_Messages => {
            //Do something here now that we have the messages.
            console.log("Emit to self that we have new messages... Unity will need a listen for this");
        }).catch(err => {
            console.error("Could not get messages");

            reject(err);
        })
    })
}


/*---------------------------*/
/*----- CHECK METHODS -----*/
/*---------------------------*/

/**
 * This checks if our MongoDB has a stored reference of this connection
 * @param {String} playerID - The ID of our connected player (connection.player.id)
 * @returns - Returns promise true/false if reference is found.
 */
function DB_checkRef(playerID = String) {
    return new Promise((resolve, reject) => {

        API.getPlayer(playerID).then((DB_playerData) => {
            if (DB_playerData) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        }).catch((err) => {
            console.error(err);
            reject(err);
        });
    })
}