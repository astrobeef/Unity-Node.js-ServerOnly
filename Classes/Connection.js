
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
        });

        socket.on("joinGame", function (unityData) {

            const dataUsername = unityData.username;
            console.log(dataUsername);

            server.onAttemptToJoinGame(connection);
            
            connection.player.username = dataUsername;
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

            console.log(message);
            const message_str = message.message;
            console.log(`"Successfully fired event to send message : ${message_str}"`);
            if(message_str !== null){
                DB_handleMessageSend(connection, connection.player.username, message_str).catch(err => console.error(err));
            }
            else{
                console.warn("Sent message was empty");
            }
        })

        socket.on("getMessages", () => {
            API.getMessages().then(DB_Messages => {
                const payload = {
                    messages : []
                };

                if(DB_Messages){
                    for(let curMes = 0; curMes < DB_Messages.length; curMes++){

                        const message_str = `${DB_Messages[curMes].username} : ${DB_Messages[curMes].message}`;

                        payload.messages.push(message_str);
                    }

                    console.log(payload);
                    console.log("^^payload");

                    connection.socket.emit("returnMessages", payload);
                }else{
                    console.warn("Could not find any messages");
                }
            }).catch(err => console.error(err));
        })
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

            //If we found a user, then...
            if (DB_User) {
                connection.player.username = DB_User.username;

                //If we do NOT have a DB reference, create one.
                DB_checkRef(connection.player.username).then((foundRef) => {
                    if (!foundRef) {
                        API.createPlayer(connection.player.username, connection.player.id)
                            .then(creationInfo => console.log(creationInfo))
                            .catch(error => console.error(error));
                    }else{
                        API.updatePlayer(connection.player.username, {connection_id : connection.player.id})
                        .then(updateInfo => console.log(updateInfo))
                        .catch(err => console.error(err));
                    }
                }).catch(err => console.log(err));
                
                //Emit the user data now that we've found the user.
                connection.socket.emit("sendUserFromToken", DB_User);

                //Return true.
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

function DB_handleMessageSend(connection = Connection, username = String, message = String){
    return new Promise((resolve, reject) => {
        API.sendMessage(username, message).then(creationInfo => {
            console.log(creationInfo);

            //Do something now that we've sent the message.
            //Emit broadcast that a message has been sent.
            console.log("Emit broadcast that a message has been sent");

            connection.socket.broadcast.emit("newMessage");
            connection.socket.emit("newMessage");

            resolve(true);

        }).catch(err => {
            
            console.error("The message could not be sent");

            reject(err);
        });
    })
}


/*---------------------------*/
/*----- CHECK METHODS -----*/
/*---------------------------*/

/**
 * This checks if our MongoDB has a stored reference of this connection
 * @param {String} username - The username of our connected player (connection.player.username)
 * @returns - Returns promise true/false if reference is found.
 */
function DB_checkRef(username = String) {
    return new Promise((resolve, reject) => {

        API.getPlayer(username).then((DB_playerData) => {
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