module.exports = class Connection {
    constructor(){
        this.socket;
        this.player;
        this.server;
        this.lobby;
    }

    //Handles all our io events and where we should route them to be handled
    createEvents() {
        const connection = this;
        const socket = connection.socket;
        const server = connection.server;
        const player = connection.player;

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
    }
}