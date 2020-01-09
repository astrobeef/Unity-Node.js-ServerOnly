/** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Server.js - This script is responsible for setting up our Game Server and initializing our Socket.io functionality.
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/*---------------------*/
/*--- Local Imports ---*/
/*---------------------*/

//Classes
const Connection = require("./Connection");
const Player = require("./Player");

//Lobbies
const LobbyBase = require("./Lobbies/LobbyBase");
const GameLobby = require("./Lobbies/GameLobby");
const GameLobbySettings = require("./Lobbies/GameLobbySettings");

/*-----------------------*/
/*--- Class to Export ---*/
/*-----------------------*/

/**
 * Sets up the game server.
 */
module.exports = class Server {
    //Our constructor for the variables needed on this class.
    constructor() {
        this.connections = [];      //The instances of socket connections to our server (players).
        this.lobbys = [];           //The instances of lobbies established on our server (game lobbies active).

        this.lobbys[0] = new LobbyBase(0);      //Set the first lobby to be a default lobby.
    }

    //Interval update every 100 milliseconds
    onUpdate() {
        const server = this;        //Set a reference to 'this' (the 'Server' class)

        //Update each lobby
        for (const id in server.lobbys) {
            server.lobbys[id].onUpdate();       //Run the update method for the lobby.  The functionality of this can vary depending on the type of lobby.
        }
    }

    /**
     * Upon socket connection, establish a new connection to our server and join the player to the default lobby.
     * @param {Socket} socket - The socket connection passed in with the call of this method.
     * @returns newly created connection.
     */
    onConnected(socket) {       //Upon an established connection, do the following...

        //ESTABLISH SOCKET CONNECTION TO OUR GAME SERVER//

        const connection = new Connection();        //Instantiate a new 'Connection' class to be used for this new socket connection (player).
        connection.socket = socket;                     //Set the 'socket' of our new connection to the request 'socket' given on the call.
        connection.player = new Player();               //Set the 'player' of our new connection to an instantiated 'Player' class.
        const server = this;                        //Set a reference to 'this' (the 'Server' class)
        connection.server = server;                     //Set the 'server' of our new connection to this instance of our Server.

        const player = connection.player;               //Set a reference to the 'player' Class we JUST instantiated on our new connection.
        const lobbys = server.lobbys;               //Set a reference to the lobbys array we established in our constructor.

        console.log(`Added new player, ${player.id}, to the server`);

        server.connections[player.id] = connection;     //Create a new key, 'player.id', in our connections on THIS server.  Set the value of this key to the connection (the player) we have just established.

        //CONNECT PLAYER TO LOBBY//

        socket.join(player.lobby);      //Using the default lobby set on the 'Player' class, connect our 'socket' (provided in the call) to that lobby.

        connection.lobby = lobbys[player.lobby];        //Set the 'lobby' of our new connection to the lobby we have just connected our 'socket' to (the default lobby on the 'Player' class).

        connection.lobby.onEnterLobby(connection);      //Run the 'onEnterLobby' method of the 'lobby' we have connected our 'socket' to.  Then, pass in our newly established 'connection' to the method.  This way, the 'lobby' has the data of our 'connection'.

        return connection;      //Return our established connection.
    }

    /**
     * Disconnects the connection from our server.
     * @param {Connection} connection - The connection (player) to be disconnected from the Server.
     */
    onDisconnected(connection = Connection) {

        //REFERENCES
        const server = this;                //Set a reference to THIS Server clas.
        const id = connection.player.id;    //Set a reference to the ID of our connected player, passed in the parameters.

        //DELETE THE CONNECTION TO THE SERVER
        delete server.connections[id];      //Delete the connection with the key of 'id' off of our connections array on our server class.

        console.log(`Player, ${connection.player.displayPlayerInformation()} has disconnected`);

        //BROADCAST DISCONNECTION
        //Broadcast to all connected sockets, with the player's lobby, that this connection has disconnected.
        connection.socket.broadcast.to(connection.player.lobby).emit("disconnected", {
            id: id
        });

        //Perform lobby clean up for the lobby, on this server, which the player was connected to.
        server.lobbys[connection.player.lobby].onLeaveLobby(connection);
    }


    /**
     * Look through our lobbies for game lobby which can be joined.  If none are found, make a new one.
     * @param {Connection} connection - The connection attempting to join the game.
     */
    onAttemptToJoinGame(connection = Connection) {

        //REFERENCES//
        const server = this;        //Set a reference to THIS Server class.
        let lobbyFound = false;     //Set default to false, for we are trying to find a lobby.

        //For all lobbies on THIS server class, filter for lobbies which are game lobbies.
        const gameLobbies = server.lobbys.filter(item => {
            return item instanceof GameLobby
        });

        console.log(`Found ${gameLobbies.length} lobbies on the server`);

        //LOOK FOR GAME LOBBY//

        //For each game lobby we have found, check if they are full.
        gameLobbies.forEach(lobby => {
            if (!lobbyFound) {  //If we still have not found a lobby, ...
                const canJoin = lobby.canEnterLobby(connection);        //Returns true/false if the connection may enter the lobby.

                //If we can join the lobby, then...
                if (canJoin) {
                    lobbyFound = true;      //We have found a lobby, so set 'lobbyFound' to true.
                    server.onSwitchLobby(connection, lobby.id);     //Run the 'onSwitchLobby' on THIS server.  Pass in the 'connection' and 'lobby.id'.
                }
            }
        });

        //CREATE NEW GAME LOBBY//

        //All game lobbies full or we have never created one
        if (!lobbyFound) {
            console.log(`Making a new game lobby`);
            const gameLobby = new GameLobby(gameLobbies.length + 1, new GameLobbySettings("FFA", 4));       //Creates a new game lobby.
            server.lobbys.push(gameLobby);      //Pushes the newly instantiated lobby into our 'lobbys' array on THIS server.
            server.onSwitchLobby(connection, gameLobby.id);     //Run the 'onSwitchLobby' on THIS server.  Pass in the 'connection' and 'lobby.id'.
        }
    }

    /**
     * Moves a connection (player) from its current lobby to another.
     * @param {Connection} connection - The connection (player) attempting to switch lobbies.
     * @param {Number} lobbyID - The index of the lobby the connection is attempting to switch to. 
     */
    onSwitchLobby(connection = Connection, lobbyID) {
        //REFERENCES
        const server = this;            //Set reference to THIS 'Server' class.
        const lobbys = server.lobbys;       //Set a reference to the 'lobbys' array on THIS Server.

        //CONNECT TO LOBBY

        connection.socket.join(lobbyID);        //Join the new lobby's socket channel
        connection.lobby = lobbys[lobbyID];     //Assign reference to the new lobby

        //RUN LOBBY LEAVE/ENTER METHODS

        lobbys[connection.player.lobby].onLeaveLobby(connection);       //For the lobby the 'connection' was connected to, run the 'onLeaveLobby' method, passing in this 'connection'.
        lobbys[lobbyID].onEnterLobby(connection);                       //For the lobby the 'connection' is connecting to, run the 'onEnterLobby' method, passing in this 'connection'.
    }
}