module.exports = class Connection {
    constructor(){
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
        if(this.db){
            console.log("We have made a connection to our MongoDB");
        }
        else{
            console.warn("We have not connected to our mongoDB");
        }

        socket.on("disconnect", function(){
            server.onDisconnected(connection);
        });

        socket.on("joinGame", function(){
            server.onAttemptToJoinGame(connection);
        });

        socket.on("fireBullet", function(unityData){
            connection.lobby.onFireBullet(connection, unityData);
        });

        socket.on("collisionDestroy", function(unityData){
            connection.lobby.onCollisionDestroy(connection, unityData);
        });

        socket.on("updatePosition", function(unityData){
            player.position.x = unityData.position.x;
            player.position.y = unityData.position.y;
            player.position.z = unityData.position.z;

            socket.broadcast.to(connection.lobby.id).emit("updatePosition", player);
        });

        socket.on("updateRotation", function(unityData){
            player.tankRotation = unityData.tankRotation;
            player.barrelRotation = unityData.barrelRotation;

            socket.broadcast.to(connection.lobby.id).emit("updateRotation", player);
        });

        this.DB_checkRef(connection);
    }

    DB_checkRef(connection = Connection){
        const db = connection.db;

        console.log(`our connection_id is ${connection.player.id}`);

        db.Player.find({connection_id : connection.player.id}, (err, data) => {
            if(err) throw err;

            if(data.length > 0){
                console.log("Found reference to this player in our DB");
            }
            else{
                console.log("No reference to this player in our DB... creating reference.");

                this.DB_createRef(connection);
            }
        })
    }

    DB_createRef(connection = Connection){
        const db = require("../models");

        console.log(`Setting reference in our DB for the player ${connection.player.id}`);

        db.Player.create({
            connection_id: connection.player.id,
            username: connection.player.username,
            connected: true
        }).then((data) => {
            console.log(data);
            console.log("created reference to the player");
        })
    }
}