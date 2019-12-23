const Connection = require("./Connection");
const Player = require("./Player");

//Lobbies
const LobbyBase = require("./Lobbies/LobbyBase");
const GameLobby = require("./Lobbies/GameLobby");
const GameLobbySettings = require("./Lobbies/GameLobbySettings");



module.exports = class Server {
    constructor(){
        this.connections = [];
        this.lobbys = [];

        this.lobbys[0] = new LobbyBase(0);
    }

    //Interval update every 100 milliseconds
    onUpdate(){
        const server = this;

        //Update each lobby
        for(const id in server.lobbys){
            server.lobbys[id].onUpdate();
        }
    }

    //Handle a new connection to the server
    onConnected(socket){
        const connection = new Connection();
        connection.socket = socket;
        connection.player = new Player();
        const server = this;
        connection.server = server;
        
        const player = connection.player;
        const lobbys = server.lobbys;

        console.log(`Added new player, ${player.id}, to the server`);
        server.connections[player.id] = connection;

        socket.join(player.lobby);

        connection.lobby = lobbys[player.lobby];
        connection.lobby.onEnterLobby(connection);

        return connection;
    }

    onDisconnected(connection = Connection){
        const server = this;
        const id = connection.player.id;

        delete server.connections[id];
        console.log(`Player, ${connection.player.displayPlayerInformation()} has disconnected`);

        connection.socket.broadcast.to(connection.player.lobby).emit("disconnected", {
            id: id
        });

        //Perform lobby clean up
        server.lobbys[connection.player.lobby].onLeaveLobby(connection);
    }

    

    onAttemptToJoinGame(connection = Connection){
        //Look through lobbies for a gameLobby
        //Check if joinable
        //If not, make a new game
        const server = this;
        let lobbyFound = false;

        const gameLobbies = server.lobbys.filter(item => {
            return item instanceof GameLobby
        });

        console.log(`Found ${gameLobbies.length} lobbies on the server`);

        gameLobbies.forEach(lobby => {
            if(!lobbyFound){
                const canJoin = lobby.canEnterLobby(connection);

                if(canJoin){
                    lobbyFound = true;
                    server.onSwitchLobby(connection, lobby.id);
                }
            }
        });

        //All game lobbies full or we have never created one
        if(!lobbyFound){
            console.log(`Making a new game lobby`);
            const gameLobby = new GameLobby(gameLobbies.length + 1, new GameLobbySettings("FFA", 4));
            server.lobbys.push(gameLobby);
            server.onSwitchLobby(connection, gameLobby.id);
        }
    }

    onSwitchLobby(connection = Connection, lobbyID){
        const server = this;

        const lobbys = server.lobbys;

        connection.socket.join(lobbyID);    //Join the new lobby's socket channel
        connection.lobby = lobbys[lobbyID]; //Assign reference to the new lobby

        lobbys[connection.player.lobby].onLeaveLobby(connection);
        lobbys[lobbyID].onEnterLobby(connection);
    }
}